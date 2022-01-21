export const req = [{
    req: 'Create table',
    text: `CREATE TABLE public.cars
    (
        "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 0 MAXVALUE 2147483647 CACHE 1 ),
        "IDCar" integer NOT NULL,
        "DateStart" date NOT NULL,
        "DateEnd" date NOT NULL,
        "Price" integer NOT NULL,
        CONSTRAINT cars_pk PRIMARY KEY ("ID")
    )
    
    TABLESPACE pg_default;
    
    ALTER TABLE IF EXISTS public.cars
        OWNER to test;
    CREATE INDEX IF NOT EXISTS idxcars
        ON public.cars USING btree
        ("IDCar" ASC NULLS LAST)
        TABLESPACE pg_default;`
},
{
    req: 'Check creation',
    text: `Select * from cars
    Limit 1`
},
{
    req: 'Check car',
    text: `Select Count(*) from cars where "IDCar" = $1 and ($2 Between "DateStart" and "DateEnd" + interval '3 day' or $3:: date + interval '3 day' >= "DateStart")`
},
{
    req: 'Rezerve car',
    text: `INSERT INTO public.cars(
        "IDCar", "DateStart", "DateEnd","Price")
        VALUES ($1,$2,$3,$4);`
},
{
    req: "Sum Price",
    text: `SELECT SUM("PriceDay")
	FROM public."Price"
	where "ID" <= $1`
},
{
    req:"Order month",
    text: `SELECT "IDCar",
	Round(CAST(SUM(Case 
		when (date_trunc('month', "DateEnd")>date_trunc('month', "DateStart")) AND ((date_part('month', "DateEnd") > date_part('month',$1::date)) AND (date_part('month', "DateStart") < date_part('month',$1))) THEN (date_trunc('month',$1::date ) + interval '1 month')::date - $1::date
		when (date_trunc('month', "DateEnd")>date_trunc('month', "DateStart")) AND (date_part('month', "DateStart") = date_part('month',$1::date)) THEN (((date_trunc('month', "DateStart") + interval '1 month')::date-"DateStart"))
		when (date_trunc('month', "DateEnd")>date_trunc('month', "DateStart")) AND (date_part('month', "DateEnd") = date_part('month',$1::date)) THEN ("DateEnd" - (date_trunc('month', "DateEnd"))::date)
		when (date_trunc('month', "DateEnd")=date_trunc('month', "DateStart")) THEN	(("DateEnd"-"DateStart"))
	end)*100/extract( day from date(date_trunc('month',$1::date)+ interval '1 month')-1)AS DECIMAL),0)  as "Day%OnMonth" FROM public.cars
	where "IDCar" = $2 and date_part('month',$1::date) Between date_part('month', "DateStart") and date_part('month', "DateEnd") 
	Group by "IDCar"`,
    ret:['IDCar','Day%OnMonth']
},
{
    req:"Check Table Price",
    text:`SELECT count(*)
	FROM public."Price";`
},
{
    req:"Create Table Price",
    test:`CREATE TABLE IF NOT EXISTS public."Price"
    (
        "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 30 CACHE 1 ),
        "PriceDay" integer NOT NULL,
        CONSTRAINT "Price_pkey" PRIMARY KEY ("ID")
    )
    
    TABLESPACE pg_default;
    
    ALTER TABLE IF EXISTS public."Price"
        OWNER to test;`
},
{
    req:"Fill Table Price",
    text:`INSERT INTO public."Price"(
        "PriceDay")
    
        VALUES
        (1000),
        (1000),
        (1000),
        (1000),
        (950),
        (950),
        (950),
        (950),
        (950),
        (900),
        (900),
        (900),
        (900),
        (900),
        (900),
        (900),
        (900),
        (850),
        (850),
        (850),
        (850),
        (850),
        (850),
        (850),
        (850),
        (850),
        (850),
        (850),
        (850),
        (850)`
}

];