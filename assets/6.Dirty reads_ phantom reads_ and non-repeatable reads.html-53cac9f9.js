import{_ as e,W as t,X as s,a2 as n}from"./framework-6a3aa88c.js";const r={},a=n('<p>这三种情况都是出现在<strong>同时处理多个事务的时候</strong></p><ul><li>脏读：一个事务读取了另外一个事务未提交的数据，如果这时第二个事务回滚，那么你读的就是临时的错的数据；</li><li>不可重复读：在一个事务中，前后读取的数据不一致（有人在此刻操作了数据） <span style="color:MediumPurple;">指修改和删除，同一行数据的<strong>内容</strong>被修改</span></li><li>幻读：由于其他事务的插入或删除操作，导致同一个事务查询内，前后读取的记录数量不一致。。<span style="color:MediumPurple;">指修新增和删除，结果集的<strong>行数</strong>发生变化</span></li></ul>',2),o=[a];function _(l,c){return t(),s("div",null,o)}const d=e(r,[["render",_],["__file","6.Dirty reads_ phantom reads_ and non-repeatable reads.html.vue"]]);export{d as default};
