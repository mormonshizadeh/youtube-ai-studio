import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/channel/analytics
 * Returns private YouTube Analytics for the connected channel:
 * - Views, Watch Time, Impressions, CTR, Avg View Duration
 * - Traffic sources, Top videos, Subscriber changes
 * Query params:
 *   ?startDate=YYYY-MM-DD (default: 28 days ago)
 *   ?endDate=YYYY-MM-DD   (default: today)
 */
export async function GET(request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('yt_access_token')?.value;

  if (!accessToken) {
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
    // 1. Get channel ID first
    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=id,snippet,statistics&mine=true',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const channelData = await channelRes.json();

    if (!channelRes.ok || channelData.error) {
      return NextResponse.json({ error: channelData.error?.message || 'Failed to fetch channel' }, { status: 401 });
    }

    const channel = channelData.items?.[0];
    const channelId = channel?.id;

    // 2. Core analytics metrics
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

    // 3. Traffic sources
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

    // 4. Top performing videos
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

    // Parse daily metrics
    const columnHeaders = metricsData.columnHeaders?.map(h => h.name) || [];
    const dailyRows = (metricsData.rows || []).map(row => {
      const obj = {};
      columnHeaders.forEach((key, i) => { obj[key] = row[i]; });
      return obj;
    });

    // Aggregate totals
    const totals = dailyRows.reduce((acc, row) => {
      acc.views = (acc.views || 0) + (row.views || 0);
      acc.watchMinutes = (acc.watchMinutes || 0) + (row.estimatedMinutesWatched || 0);
      acc.impressions = (acc.impressions || 0) + (row.impressions || 0);
      acc.subscribersGained = (acc.subscribersGained || 0) + (row.subscribersGained || 0);
      acc.subscribersLost = (acc.subscribersLost || 0) + (row.subscribersLost || 0);
      return acc;
    }, {});

    const avgCTR = dailyRows.length > 0
      ? dailyRows.reduce((sum, r) => sum + (r.impressionClickThroughRate || 0), 0) / dailyRows.length
      : 0;
    const avgViewDuration = dailyRows.length > 0
      ? dailyRows.reduce((sum, r) => sum + (r.averageViewDuration || 0), 0) / dailyRows.length
      : 0;

    // Parse traffic sources
    const trafficSources = (trafficData.rows || []).map(row => ({
      source: row[0],
      views: row[1],
    }));

    // Parse top videos (we have IDs, need titles)
    const videoIds = (topVideosData.rows || []).map(r => r[0]).join(',');
    let topVideos = [];
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
          title: vid?.snippet?.title || 'Unknown',
          thumbnail: vid?.snippet?.thumbnails?.medium?.url || '',
          views: row[1],
          watchMinutes: row[2],
          ctr: ((row[3] || 0) * 100).toFixed(2) + '%',
        };
      });
    }

    return NextResponse.json({
      channel: {
        id: channelId,
        title: channel?.snippet?.title,
        thumbnail: channel?.snippet?.thumbnails?.default?.url,
        subscriberCount: channel?.statistics?.subscriberCount,
        totalViews: channel?.statistics?.viewCount,
        videoCount: channel?.statistics?.videoCount,
      },
      period: { startDate, endDate },
      summary: {
        views: totals.views || 0,
        watchHours: Math.round((totals.watchMinutes || 0) / 60),
        impressions: totals.impressions || 0,
        ctr: (avgCTR * 100).toFixed(2) + '%',
        avgViewDuration: Math.round(avgViewDuration) + 's',
        netSubscribers: (totals.subscribersGained || 0) - (totals.subscribersLost || 0),
      },
      dailyMetrics: dailyRows,
      trafficSources,
      topVideos,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
