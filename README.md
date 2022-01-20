## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
```bash
Техническое задание для Hyndai Mobility.
Данный сервис позволяет бронировать автомобили.
И собирать отчет по средней загрузки автомобилей за месяц.
```
## Installation

```bash
$ npm install
```


- Не забудьте установить и поднять PostreSQL сервер
- Настройки connect к базе-[./cars/connectDB.ts]
  
- Цена дня берется из базы Price, ее нужно создать и заполнить.
```bash

-- Table: public.Price

-- DROP TABLE IF EXISTS public."Price";

CREATE TABLE IF NOT EXISTS public."Price"
(
    "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 30 CACHE 1 ),
    "PriceDay" integer NOT NULL,
    CONSTRAINT "Price_pkey" PRIMARY KEY ("ID")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Price"
    OWNER to test;

```
![Image](https://raw.githubusercontent.com/Metaliist/NestForHyndai/master/image/price.png)    
```bash
База cars создается при первом запросе GET/POST 
SQL запросы для работы с БД хранятся в [./cars/Request.ts]
```

## Running the app

```bash
# development

$ npm run start
```
## Описание действий бронирования.
```bash
После открыть программу для отправки GET/POST запроса.Для примера воспользуемся POSTMAN.
-В строке адресс пишем - [localhost:3000/]
В тело запроса помещаем JSON (Для резервирования или проверки статуса)
{
    "IDCar": 1,
    "DateStart": "2022-01-20",
    "DateEnd": "2022-02-03"
} 
Отправляем
Типы запроса и ответ на них: 
- Post('check') 
    в ответ если все ок, вернет: Rezerv / Not Rezerv.
- Post('reserve') 
    в ответ если все ок, вернет: (I have reserved a car, everything is fine) / (The car has already been reserved, choose another car or dates).
- Post
    Если дата начала брони или конца выподает на выходные то вернет: The beginning or end of the lease should fall on weekdays
    Если дата не валидная: Dates are not correctly selected
    Если длина брони больше 30 дней: It is not possible to reserve for more than 30 days
    Если id автомобиля больше 5 то: The identification car is specified more than there is in the park 
```
## Описание работы
```bash
    Сервис принимает Post и Get запросы и работает с бд.

```
## Пример работы для бронирования авто. 
```bash
  #В независимости от типа запроса, мы проверяем connect к бд и наличие табл cars, если нет соедениения то создаем, и если нет table тоже создаем.
  Принимаем Post('/check') с телом :
  {
    "IDCar": 1,
    "DateStart": "2022-01-20",
    "DateEnd": "2022-02-03"
  } 
  Проверяем существование табл cars, если ее нет то создаем.
  Проверяем валидность дат, id автомобиля, срок аренды. Если все ок, то делаем select в бд и если записей в бд нет, то считаем что ссесии аренды нет для данных критериев.
  Возвращаем Not Rezerv.
 ``` 
 ![Gif](https://raw.githubusercontent.com/Metaliist/NestForHyndai/master/image/Get_.gif)    
 ```bash
  Принимаем Post('/reserve') с телом :
  {
    "IDCar": 1,
    "DateStart": "2022-01-20",
    "DateEnd": "2022-02-03"
  } 
  Проверяем существование табл cars, если ее нет то создаем.
  Проверяем валидность дат, id автомобиля, срок аренды. Если все ок, то проверяем наличие ссесии для этих критериев, работает как и для GET, если ссесии нет, то рассчитываем стоимость и делаем Insert в бд, куда пишем ID(порядковый номер записи), IDcar(ID машины), DateStart(Дата начала аренды), DateEnd(Дата конца аренды), Price(стоимость аренды за весь срок). 
  Возвращаем если все ок(I have reserved a car, everything is fine).
```
![Gif](https://raw.githubusercontent.com/Metaliist/NestForHyndai/master/image/Post_.gif)    
## Записи в БД

![Image](https://raw.githubusercontent.com/Metaliist/NestForHyndai/master/image/BD.png)

## Отчет средней загрузки автомобилей за месяц, по каждому авто и по всем.
```bash
Точка входа одна Post на '/order'. 
В тело помещаем JSON
{
    "IDCar": 1,
    "Month": "2022-05",
    "all": false 
}
Флаг all Отвечает за тип отчета, по одному авто или по всем.
Month передаем год-мес
IDCar нужно только если берем статистику по одному авто.
Проверяем существование табл cars, если ее нет то создаем. Если по одному авто, то проверяем валидность IDcar.
Дальше уже по флагу смотрим запускаем разные функ.
Запрос к бд один и тот же.
Если запрос не нашел записей удовл условиям, то возвращаем 0%, иначе возвращаем что вернул select
```
![Gif](https://raw.githubusercontent.com/Metaliist/NestForHyndai/master/image/report_.gif)   
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Titov Maxim]

## License

Nest is [MIT licensed](LICENSE).
