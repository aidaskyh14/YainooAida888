/* พรีวิวเท่านั้น: แทนที่ city-catalog.js ของจริง (ที่อยู่บนเซิร์ฟเวอร์) — ส่วนสาธารณะมาจาก city-public.js · ส่วนลับ (ของชอบ/คะแนน) สุ่มขึ้นมาเพื่อทดสอบ ไม่ใช่ค่าจริงในเกม */
import * as P from '../city-public.js';
export const {MEN,BUILDINGS,BUILDING,RX,RZ,GATE,RIVER_Z,DATES,HARD_NAME,MOODS,PAGEANT,HOUSE_UP,KIDS,SEASON_DAYS,SEASONS,ENTRY_DEFAULT,WED,HEART,HEARTS,LOCK_HEARTS,IDLE_SOFT_MIN,IDLE_KICK_MIN,GIFT_KIND}=P;
export const HARD={mid:{...P.HARD.mid,gift:1,skill:1,dayCap:300},hard:{...P.HARD.hard,gift:.85,skill:1.2,dayCap:250},vhard:{...P.HARD.vhard,gift:.7,skill:1.5,dayCap:200}};
export const MAX_IN_CITY=50;
export const GIFT_PTS={love:60,like:30,neutral:8,dislike:-15,hate:-40,repeat:-20,talk:15,secret:90,weekly:45};
export const HUSBAND={happyStart:60,giftChance:.5,complainPenalty:100000,complainLowHappy:40,keepPending:3};
export const HEART_REWARDS={3:{merit:30000},6:{merit:80000},9:{merit:200000}};
export const WED_REWARD={merit:500000};
/* ของชอบต่อคน (สุ่มคงที่จากเลขคน) */
const POOL=['rose','daisy','sunflower','tulip','lotus','mango','strawberry','grape','banana','corn','egg','milk','cheese','food-01','food-02','food-03','wine-rose','drink-1','honey','apple','peach','orange','cherry','pumpkin','chili'];
const SKILLS=['sell','cook','crop','flower','barn','fruit','alpaca'];
const pick=(seed,n,skip)=>{const out=[];let s=seed*7919+13;for(let i=0;out.length<n&&i<60;i++){s=(s*16807)%2147483647;const k=POOL[s%POOL.length];if(!out.includes(k)&&!skip.includes(k))out.push(k);}return out;};
export const MAN={};for(const m of MEN){const no=m.no;const love=pick(no,2,[]);const like=pick(no+100,4,love);const hate=pick(no+200,2,[...love,...like]);const dislike=pick(no+300,3,[...love,...like,...hate]);MAN[m.id]={...m,love,like,hate,dislike,skill:SKILLS[no%SKILLS.length]};}
