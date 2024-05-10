import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimulationController } from './simulation.controller';
import { SimulationGateway } from './simulation.gateway';
import { WebRTCGateway } from './webrtc/webrtc.gateway';

@Module({
  imports: [WebRTCGateway],
  controllers: [AppController, SimulationController],
  providers: [AppService, SimulationGateway],
})
export class AppModule {}