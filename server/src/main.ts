import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Step Project API')
    .setDescription('API documentation for Step Project')
    .setVersion('1.0')
    .addTag('api')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//Хай це буде застосунок для створення тасок для кожного користувача. Користувач може відновлювати таски зі збережених.
//Користувачу має приходити сповіщення про те що він має зробити за кілька годин до того як це треба зробити.
//Користувач має мати змогу авторизовуватись через гугл або гітхаб.

//Робимо ендпоінти для тасок
//пагінація
//веб хуки
//фантомне видалення
//збереження користувача
//авторизація через токени
//auth guard - розібратись