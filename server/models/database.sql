create TABLE users(
  "id" SERIAL4 PRIMARY KEY,
  "firstname" TEXT,
  "lastname" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "password" TEXT NOT NULL,
  "ts" TIMESTAMP, 
  "usertype_id" INT2,
  "avatar" TEXT,
  "archive" BOOLEAN DEFAULT false
);

-- // 0:"admin" // 1:"manager" // 2:"seller"
create TABLE user_types(
  "id" SERIAL4 PRIMARY KEY,
  "usertype" TEXT NOT NULL,
);

create TABLE stores(
  "id" SERIAL4 PRIMARY KEY,
  "name" TEXT NOT NULL,
  "ts" TIMESTAMP
);

create TABLE products(
  "id" SERIAL4 PRIMARY KEY,
  "product" TEXT NOT NULL, 
  -- "producttype_id" INT2, 
  "quantity" INT4, 
  "cost" INT2, 
  "ts" TIMESTAMP
);

create TABLE product_types(
  "id" SERIAL4 PRIMARY KEY,
  "proceduretype" TEXT NOT NULL
);

create TABLE files(
  "id" SERIAL4 PRIMARY KEY,
  "filename" TEXT NOT NULL, 
  "type" TEXT, 
  "size" INT4, 
  "path" TEXT, 
  "user_id" INT4, 
  "doc_id" INT4, 
  "ts" TIMESTAMP
);

