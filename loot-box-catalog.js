// Confirmed Season 3 material book. Weights total 100 for every box.
const row=(weight,type,value)=>({weight,type,value});
const common=[row(10,'animal'),row(20,'salt'),row(30,'merit',[10,300]),row(6,'grass',10),row(6,'item',['musicbox',3]),row(6,'item',['fuel',100]),row(5,'item',['hat',1]),row(6,'food',2),row(6,'drink',1),row(5,'rod',1)];
const box=(id,key,path,image,rows)=>({id,key,path,image,animation:image.replace('.webp','-open-4x4.webp'),rows});
export const BOXES=[
 box('dog','box-dog','bag.item.boxdog','dog-box-dog.webp',common),
 box('cat','box-cat','bag.box.cat','cat-box-cat.webp',common),
 box('hamster','box-hamster','bag.box.hamster','hamster-box-hamster.webp',[...common.slice(0,-1),row(3,'rod',1),row(2,'medicine',[3,5])]),
 box('alpaca','box-alpaca','sub.alpaca.bag.box','boxes-box-alpaca.webp',[row(10,'animal'),row(30,'salt'),row(12,'item',['hay',10]),row(12,'item',['musicbox',10]),row(12,'item',['pestle',30]),row(12,'grass',30),row(12,'item',['license',10])]),
 box('ostrich','bird-box-ostrich','bag.birdbox.ostrich','boxes-box-ostrich.webp',[row(20,'animal'),row(30,'salt'),row(3,'merit',[500,1000]),row(10,'food',5),row(10,'grass',30),row(9,'item',['license',10]),row(9,'item',['cake',10]),row(9,'item',['coconut',30])]),
 box('dodo','bird-box-dodo','bag.birdbox.dodo','boxes-box-dodo.webp',[row(10,'animal'),row(50,'salt'),row(3,'merit',[100,500]),row(8,'item',['hay',100]),row(8,'item',['hat',30]),row(7,'item',['wings',30]),row(7,'item',['coconut',30]),row(7,'medicine',[3,5])]),
 box('plant','box-plant','bag.box.plant','boxes-box-clover.webp',[row(85,'plants'),row(10,'salt'),row(5,'merit',[100,300])]),
 box('fruit','box-fruit','bag.box.fruit','boxes-box-berry.webp',[row(19,'item',['peach',30]),row(19,'item',['orange',30]),row(19,'item',['apple',30]),row(19,'item',['cherry',30]),row(21,'flower',10),row(3,'merit',[300,1800])])
];
export const BOX_QUANTITIES=[1,10,50,100,500];
export const getBoxCount=(game,box)=>box.path.split('.').reduce((o,k)=>o?.[k],game)||0;
