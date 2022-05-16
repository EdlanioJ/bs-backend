import { Injectable } from '@nestjs/common';
import * as _cluster from 'cluster';
import * as os from 'os';

type Callback = () => void;

const cluster = _cluster as unknown as _cluster.Cluster;

const numCPUs = os.cpus().length;

@Injectable()
export class ClusterService {
  static clusterize(callback: Callback) {
    if (cluster.isPrimary) {
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(
          `worker ${worker.process.pid} died with code ${code} and signal ${signal}`,
        );
        cluster.fork();
      });
    } else {
      callback();
    }
  }
}
