import mqtt from 'mqtt';

const BROKER_URL = 'wss://mqtt.okas.one:9001';
const TOPIC = 'f898321a22ad4426aac97f91becf02ba/okas/export';

export async function publishConfig(payload) {
  return new Promise((resolve, reject) => {
    const client = mqtt.connect(BROKER_URL, {
      username: 'hivemq',
      password: 'Hivemq@123',
      clientId: `design-studio-${Math.random().toString(16).slice(2, 10)}`,
      connectTimeout: 8000,
      reconnectPeriod: 0,
    });

    const cleanup = (err) => {
      client.end(true);
      if (err) reject(err); else resolve();
    };

    client.on('connect', () => {
      client.publish(TOPIC, JSON.stringify(payload), { qos: 1 }, (err) => {
        cleanup(err ?? undefined);
      });
    });

    client.on('error', (err) => cleanup(err));

    setTimeout(() => cleanup(new Error('Connection timeout')), 10000);
  });
}
