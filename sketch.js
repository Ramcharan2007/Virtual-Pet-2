var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
 

function preload()
{
  happyDog=loadImage("images/dogImg1.png")
  sadDog=loadImage("images/dogImg.png");
}

function setup() 
{
  database=firebase.database();

	createCanvas(800,400);

  foodObj=new Food();

  dog=createSprite(700,220,20,50);
  dog.addImage(sadDog);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() 
{  
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data)
  {
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(15);

  text("Food Stock : "+ foodObj.getFoodStock(), 500,30);

  if(lastFed>=12)
  {
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
  }

  else if(lastFed==0)
  {
    text("Last Feed : 12 AM",350,30);
  }

  else
  {
    text("Last Feed : "+ lastFed + " AM", 350,30);
  }

  drawSprites();
}

function readStock(data)
{
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog()
{
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update(
  {
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods()
{
  foodS++;
  database.ref('/').update(
  {
    Food:foodS
  })
}