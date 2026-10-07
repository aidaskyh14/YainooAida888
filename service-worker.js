// ตัวล้างของซีซั่น 2: ถ้ามือถือเคยติดตั้งแอปซีซั่น 2 ไว้ ไฟล์นี้จะลบแคชเก่าแล้วถอนตัวเอง
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())await caches.delete(k);await self.registration.unregister();for(const c of await self.clients.matchAll({type:'window'}))c.navigate(c.url);})()));
