// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimulationController } from './simulation.controller';
import { SimulationGateway } from './simulation.gateway';

@Module({
  imports: [],
  controllers: [AppController, SimulationController],
  providers: [AppService, SimulationGateway],
})
export class AppModule {}