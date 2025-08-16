import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exceptions/globalExceptionFilter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Notes app Digital Harbor')
    .setDescription(
      'Swagger documentation for the Digital Harbor MidPath notes app server. \n\n In this document you will find the routes used to fecth, create, update or delete the differents values or rows in the Database under the /Notes, /Users, /Filters, /Tags and /Auth directions. \n\n You may also find the Schemas section at the end of the document, this segment displays all the DTOs (Data transfer Objects) used on the request methods given in the previous section. \n\n Each segment of the documentation will have its respective details, those will allow you to navigate and test every request that the server can receive. The README of this with a full guide on how to interact with the server is also available in the github repo of this project: https://github.com/E-Doggo/dh-notes-server \n\n You can also see an example of the usage of this documentation on this link: https://drive.google.com/drive/folders/1K-ZkLI-8r-xS2zAr6b9fFPH8AlkhgyNu?usp=drive_link \n\n In case of any extra questions or doubts please contact me with any of the following contacts \n\n Email: rodrigo.guardia316@gmail.com \n\n Phone: (+591) 7-072-8551 \n\n Instagram: @r_guardia_',
    )
    .setVersion('1.0')
    .addTag(
      'Auth',
      'request methods to register an login to the app (No authorization required)',
    )
    .addTag(
      'Users',
      'request methods to get profile of a single user or all users (Bearer authorization required)',
    )
    .addTag(
      'Notes',
      'request methods to create/update/delete/archive/read notes for a specific user and read all notes if user is administrator (Bearer authorization required)',
    )
    .addTag(
      'Tags',
      'request methods to create, delete and fetch tags by user (Bearer authorization required)',
    )
    .addTag(
      'Filters',
      'request methods to read and update filters for a user (Bearer authorization required)',
    )
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
