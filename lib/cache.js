
//基于LinkedList LRU 的缓存
//参考 vue 1.1 src/cache.js
/*这个cache的设计思路是：
基于双向链表(没有循环) 
最近访问的元素放到链表的末尾(tail)  
最少访问的元素放在链表的头部(head)
如果缓存达到最大限制,则剔除链表中的head元素,然后再把新加的元素放在链表的末尾(tail)

链表中的每个节点(entry)的结构 
entry:{
  key:xx
  value:xx
  prev:xx 指向前一个节点
  next:xx 指向下一个节点 
}

定义一个_keymap 存放每个元素对应的 entry
_keymap:{
   key:entry
}
_keymap 中的 key 和 entry中的 key 一致
便于快速取链表中的元素 而不必遍历链表
整个cache 的结构
cache:{

   size:0
   limit:xx,
   head:undefined, 链表头  entry {key:key,value:value,prev:prev,next:next}
   tail:undefined, 链表尾  entry {key:key,value:value,prev:prev,next:next}
   _keymap:存放每个元素(entry) {key:entry}

}
head tail _keymap[key] 都指向 entry  对于他们来说都是指针(内存中的一段地址如果指向同一个对象 那么这个指针就相等)
对于链表其实只要给定头节点,就能找到尾节点 */

function Cache(limit){

     this.size = 0;

     this.limit = limit;

     this.head = this.tail = undefined;

     this._keymap = new Map();
}


var p = Cache.prototype;

//给链表中设置键值
p.put = function(key, value){

   //如果链表中的元素已经达到最大限制
   var removed;
   if(this.size === this.limit){
      //弹出链表中的第一个元素
      //这是链表中就多出一个位置 给新元素    
      removed = this.shift(); 
   }


   //先看看这个entry 是否存在

   var entry = this.get(key, true); 
    
   //如果entry 不存在的话 就新创建一个 entry 
   if(!entry){
       
         entry = {
         	key : key
         }
         //此时_keymap 中的key 指向 entry
         this._keymap[key] = entry;
         //对于第一个元素  head 和 entry
         //之后的元素就是 都放在 tail 后面了。。。
         //新增的entry 放在 末尾 
         if(this.tail){

           //先把 tail 指向新借的 entry
           this.tail.next = entry;
           entry.prev = this.tail; 
           
         }else{
         	this.head = entry;
         } 
         
         this.tail = entry;

         this.size++; 
   }

   //此时 无论entry 是否存在
   //对于已经存在的 entry 此时就是单纯的更新一个 value
   //对于新创建的 entry 此时就是新增一个 value
   entry.value = value; 
   return removed;
}

// 获取链表中的值
// 这个函数的意思是只要访问 key 对应的值 那么这个值就会放到 链表的末尾
p.get = function(key, returnEntry){
     
     //先从 _keymap 中 获取 
     var entry = this._keymap[key];

     //如果entry 不存在的话 直接返回
     if(entry === undefined){
         return;
     }

     //如果 entry 是最后一个节点的话 直接返回就行
     if(this.tail === entry){
        return returnEntry?entry:entry.value;   
     }
     

     //如果当前节点有下一个节点的话
     if(entry.next){
          //如果是头节点的话
          //head.prev 为 undefined 
          if(this.head === entry){
              //头节点指向 当前节点的下一个节点
              this.head = entry.next;
          }
          //在指回来
          entry.next.prev = entry.prev; 
     }
     

     //说明 entry 不是第一个节点 也不是 最后一个节点  
     if(entry.prev){
         entry.prev.next = entry.next; 
     }
     
     
     //这个时候 其实时把 entry 放在 tail的后面
     entry.next = undefined;
     entry.prev = this.tail;
     if(this.tail){
         this.tail.next = entry;           
     }
     
     //把this.tail 指向 entry
     this.tail = entry;
     return returnEntry ? entry : entry.value;
}

 
//拿掉头节点
p.shift = function(){

     var entry = this.head;
     
     if(entry){
         
         //head 指向下一个节点
         this.head = this.head.next;

         //头节点的 prev
         this.head.prev = undefined;

         //当前节点的 prev
         entry.prev = undefined;
         
         //当前节点的 next 
         entry.next = undefined;
         
         //key_map 中的key  
         this._keymap[entry.key] = undefined;
          
         //移除掉元素 递减 
         this.size--;
     }

     return entry;
}

//以字符串的形式 显示所有元素
p.toString = function(){

    var entry = this.head;
    var str = "";
    while(entry){
        str += "+++++++++"+entry.key;
        entry = entry.next;
    }

    return str;       
}

var linkedList = new Cache(5);

linkedList.put("one", 10);
linkedList.put("two", 20);
linkedList.put("three", 30);
linkedList.put("four", 40);
linkedList.put("five", 50);

console.log(linkedList.toString()); 
console.log();