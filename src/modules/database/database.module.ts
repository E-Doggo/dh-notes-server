import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const env = configService.get<string>('NODE_ENV');
        const url =
          env === 'production'
            ? configService.get<string>('PROD_DB_URL')
            : configService.get<string>('DEV_DB_URL');

        return {
          type: 'postgres',
          url: url,
          autoLoadEntities: true,
          timezone: 'GMT-4',
          synchronize: true,
          ssl: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
