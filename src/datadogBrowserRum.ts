import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: 'f49b8e22-6fb3-4c3d-a855-cf003c3d930b',
  clientToken: 'pub93799e5134bb5781de9a4d5362d7a8e0',
  site: 'us5.datadoghq.com',
  service:'cwsimulate',
  env:'prod',
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  sampleRate: 100,
  premiumSampleRate: 100,
  trackInteractions: true,
  defaultPrivacyLevel:'mask-user-input'
});

datadogRum.startSessionReplayRecording();
