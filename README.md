# localStorage-Cache
linkedList-LRU-Cache

>这个cache的设计思路是：
>基于双向链表(没有循环) 
>最近访问的元素放到链表的末尾(tail)  
>最少访问的元素放在链表的头部(head)
>如果缓存达到最大限制,则剔除链表中的head元素,然后再把新加的元素放在链表的末尾(tail)

>链表中的每个节点(entry)的结构 
entry:{
  key:xx
  value:xx
  prev:xx 指向前一个节点
  next:xx 指向下一个节点 
}

>定义一个_keymap 存放每个元素对应的 entry
`<_keymap:{
   key:entry
}>`
_keymap 中的 key 和 entry中的 key 一致
>便于快速取链表中的元素 而不必遍历链表
>整个cache 的结构
`<cache:{

   size:0
   limit:xx,
   head:undefined, 链表头  entry {key:key,value:value,prev:prev,next:next}
   tail:undefined, 链表尾  entry {key:key,value:value,prev:prev,next:next}
   _keymap:存放每个元素(entry) {key:entry}

}>`
>head tail _keymap[key] 都指向 entry  对于他们来说都是指针(内存中的一段地址如果指向同一个对象 
>那么这个指针就相等)
>对于链表其实只要给定头节点,就能找到尾节点 
