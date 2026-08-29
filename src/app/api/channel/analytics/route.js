import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/channel/analytics
 * Returns private YouTube Analytics for the connected channel
 */
export async function GET(request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('yt_access_token')?.value;

  if (!accessToken) {
    console.log('[Analytics API] No yt_access_token cookie found');
    return NextResponse.json({ error: 'Not authenticated. Please connect your YouTube channel.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
  const startDate = searchParams.get('startDate') || (() => {
    const d = new Date();
    d.setDate(d.getDate() - 28);
    return d.toISOString().split('T')[0];
  })();

  try {
    // 1. Get channel ID
    console.log('[Analytics API] Fetching channel with access token...');
    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=id,snippet,statistics&mine=true',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const channelData = await channelRes.json();

    if (!channelRes.ok || channelData.error) {
      console.error('[Analytics API] Google Channels API error:', channelData.error);
      return NextResponse.json({
        error: channelData.error?.message || 'Failed to fetch channel from Google YouTube API'
      }, { status: channelRes.status || 400 });
    }

    if (!channelData.items || channelData.items.length === 0) {
      console.log('[Analytics API] No YouTube channel found for this Google account');
      return NextResponse.json({
        error: 'No active YouTube channel was found for this Google account. Please create a channel on YouTube first.'
      }, { status: 404 });
    }

    const channel = channelData.items[0];
    const channelId = channel.id;
    console.log(`[Analytics API] Found channel: ${channel.snippet?.title} (${channelId})`);

    // 2. Fetch YouTube Analytics metrics
    let dailyRows = [];
    let totals = { views: 0, watchMinutes: 0, impressions: 0, subscribersGained: 0, subscribersLost: 0 };
    let avgCTR = 0;
    let avgViewDuration = 0;

    try {
      const metricsRes = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?` +
        new URLSearchParams({
          ids: `channel==${channelId}`,
          startDate,
          endDate,
          metrics: 'views,estimatedMinutesWatched,impressions,impressionClickThroughRate,averageViewDuration,subscribersGained,subscribersLost',
          dimensions: 'day',
          sort: 'day',
        }),
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const metricsData = await metricsRes.json();

      if (metricsRes.ok && !metricsData.error) {
        const columnHeaders = metricsData.columnHeaders?.map(h => h.name) || [];
        dailyRows = (metricsData.rows || []).map(row => {
          const obj = {};
          columnHeaders.forEach((key, i) => { obj[key] = row[i]; });
          return obj;
        });

        totals = dailyRows.reduce((acc, row) => {
          acc.views = (acc.views || 0) + (row.views || 0);
          acc.watchMinutes = (acc.watchMinutes || 0) + (row.estimatedMinutesWatched || 0);
          acc.impressions = (acc.impressions || 0) + (row.impressions || 0);
          acc.subscribersGained = (acc.subscribersGained || 0) + (row.subscribersGained || 0);
          acc.subscribersLost = (acc.subscribersLost || 0) + (row.subscribersLost || 0);
          return acc;
        }, { views: 0, watchMinutes: 0, impressions: 0, subscribersGained: 0, subscribersLost: 0 });

        avgCTR = dailyRows.length > 0
          ? dailyRows.reduce((sum, r) => sum + (r.impressionClickThroughRate || 0), 0) / dailyRows.length
          : 0;
        avgViewDuration = dailyRows.length > 0
          ? dailyRows.reduce((sum, r) => sum + (r.averageViewDuration || 0), 0) / dailyRows.length
          : 0;
      } else {
        console.warn('[Analytics API] YouTube Analytics reports error (API might need enabling):', metricsData.error);
      }
    } catch (metricErr) {
      console.warn('[Analytics API] Could not fetch analytics reports:', metricErr.message);
    }

    // 3. Traffic sources
    let trafficSources = [];
    try {
      const trafficRes = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?` +
        new URLSearchParams({
          ids: `channel==${channelId}`,
          startDate,
          endDate,
          metrics: 'views',
          dimensions: 'insightTrafficSourceType',
          sort: '-views',
          maxResults: '8',
        }),
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const trafficData = await trafficRes.json();
      if (trafficRes.ok && !trafficData.error) {
        trafficSources = (trafficData.rows || []).map(row => ({
          source: row[0],
          views: row[1],
        }));
      }
    } catch (trafficErr) {
      console.warn('[Analytics API] Traffic sources fetch error:', trafficErr.message);
    }

    // 4. Top videos
    let topVideos = [];
    try {
      const topVideosRes = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?` +
        new URLSearchParams({
          ids: `channel==${channelId}`,
          startDate,
          endDate,
          metrics: 'views,estimatedMinutesWatched,impressionClickThroughRate',
          dimensions: 'video',
          sort: '-views',
          maxResults: '10',
        }),
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const topVideosData = await topVideosRes.json();

      const videoIds = (topVideosData.rows || []).map(r => r[0]).join(',');
      if (videoIds) {
        const videosRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const videosData = await videosRes.json();
        const videoMap = {};
        (videosData.items || []).forEach(v => { videoMap[v.id] = v; });

        topVideos = (topVideosData.rows || []).map(row => {
          const vid = videoMap[row[0]];
          return {
            id: row[0],
            title: vid?.snippet?.title || 'Video ' + row[0],
            thumbnail: vid?.snippet?.thumbnails?.medium?.url || '',
            views: row[1],
            watchMinutes: row[2],
            ctr: ((row[3] || 0) * 100).toFixed(2) + '%',
          };
        });
      }
    } catch (topErr) {
      console.warn('[Analytics API] Top videos fetch error:', topErr.message);
    }

    // If analytics reports were empty (e.g. new channel or brand new API access), fallback to basic stats
    const totalViews = channel.statistics?.viewCount ? parseInt(channel.statistics.viewCount) : 0;
    const subscriberCount = channel.statistics?.subscriberCount ? parseInt(channel.statistics.subscriberCount) : 0;

    return NextResponse.json({
      channel: {
        id: channelId,
        title: channel.snippet?.title,
        thumbnail: channel.snippet?.thumbnails?.default?.url || channel.snippet?.thumbnails?.medium?.url,
        subscriberCount: subscriberCount,
        totalViews: totalViews,
        videoCount: channel.statistics?.videoCount,
      },
      period: { startDate, endDate },
      summary: {
        views: totals.views || totalViews,
        watchHours: Math.round((totals.watchMinutes || 0) / 60),
        impressions: totals.impressions || 0,
        ctr: avgCTR > 0 ? (avgCTR * 100).toFixed(2) + '%' : 'N/A',
        avgViewDuration: Math.round(avgViewDuration) + 's',
        netSubscribers: (totals.subscribersGained || 0) - (totals.subscribersLost || 0),
      },
      dailyMetrics: dailyRows,
      trafficSources,
      topVideos,
    });
  } catch (err) {
    console.error('[Analytics API] Fatal error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
