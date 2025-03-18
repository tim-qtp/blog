import{_ as s,W as a,X as l,a2 as o}from"./framework-6a3aa88c.js";const e={},t=o('<p>什么是hash冲突：</p><p>总会出现不同的数据经过计算后得到的hash值，然后再取模以后的值是一样的情况，因为你的初始化空间是有限的。</p><p><strong>怎么解决呢？</strong></p><ul><li><span style="color:#FF0000;">开放定址法</span>：从发生冲突的地方按照一定次序，从hash表中找到一个空闲的位置，然后把发生冲突的元素存入到这个位置；在java中ThreadLocal就用到了线性探针法；</li><li><span style="color:#FF0000;">链式寻址法</span>：对存在hash冲突的key，hahsmap将这些key组成一个单向链表，然后通过尾插法保存到当前位置的尾部；为了保证查询效率，当链表长度大于8，并且数组长度大于等于64的时候，hashmap会将当前链表转换为红黑树；</li><li><span style="color:#FF0000;">多次hash法</span>：布隆过滤器；</li></ul>',4),n=[t];function c(h,_){return a(),l("div",null,n)}const p=s(e,[["render",c],["__file","3.Hash collision.html.vue"]]);export{p as default};
