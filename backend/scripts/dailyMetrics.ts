import mongoose from 'mongoose';
import Metric from '../src/models/Metric';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';

(async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const start = dayjs().subtract(1, 'day').toDate();
  const end   = new Date();

  // @ts-expect-error: $percentile is a valid MongoDB 5.2+ operator but not in types yet
  const [result] = await Metric.aggregate([
    { $match: { path: '/api/snippets/search', createdAt: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: null,
        p50: { $percentile: { input: '$ms', p: [0.5], method: 'approximate' } },
        p95: { $percentile: { input: '$ms', p: [0.95], method: 'approximate' } },
        count: { $sum: 1 },
      },
    },
  ]);

  let output;
  if (result) {
    output = `Search metrics ${start.toDateString()} → p50=${result.p50[0]} ms, p95=${result.p95[0]} ms, n=${result.count}\n`;
  } else {
    output = `Search metrics ${start.toDateString()} → No data found for /api/snippets/search\n`;
  }

  console.log(output);

  // Append to metrics_output.txt in the same directory
  fs.writeFileSync(path.join(__dirname, 'metrics_output.txt'), output, { flag: 'a' });
  process.exit(0);
})();
