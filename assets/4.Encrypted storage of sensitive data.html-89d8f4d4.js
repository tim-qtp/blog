import{_ as n,W as s,X as a,a2 as e}from"./framework-6a3aa88c.js";const t={},l=e(`<p><strong>加密配置</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># 配置数据源，底层被 ShardingSphere 进行了代理</span>
<span class="token key atrule">dataSources</span><span class="token punctuation">:</span>
  <span class="token key atrule">ds_0</span><span class="token punctuation">:</span>
    <span class="token key atrule">dataSourceClassName</span><span class="token punctuation">:</span> com.zaxxer.hikari.HikariDataSource
    <span class="token key atrule">driverClassName</span><span class="token punctuation">:</span> com.mysql.cj.jdbc.Driver
    <span class="token key atrule">jdbcUrl</span><span class="token punctuation">:</span> jdbc<span class="token punctuation">:</span>mysql<span class="token punctuation">:</span>//127.0.0.1<span class="token punctuation">:</span>3306/link<span class="token punctuation">?</span>useUnicode=true<span class="token important">&amp;characterEncoding=UTF-8&amp;rewriteBatchedStatements=true&amp;allowMultiQueries=true&amp;serverTimezone=Asia/Shanghai</span>
    <span class="token key atrule">username</span><span class="token punctuation">:</span> root
    <span class="token key atrule">password</span><span class="token punctuation">:</span> root

<span class="token key atrule">rules</span><span class="token punctuation">:</span>
<span class="token comment"># 数据加密存储规则</span>
  <span class="token punctuation">-</span> <span class="token tag">!ENCRYPT</span>
    <span class="token comment"># 需要加密的表集合</span>
    <span class="token key atrule">tables</span><span class="token punctuation">:</span>
      <span class="token comment"># 用户表</span>
      <span class="token key atrule">t_user</span><span class="token punctuation">:</span>
        <span class="token comment"># 用户表中哪些字段需要进行加密</span>
        <span class="token key atrule">columns</span><span class="token punctuation">:</span>
          <span class="token comment"># 手机号字段，逻辑字段，不一定是在数据库中真实存在</span>
          <span class="token key atrule">phone</span><span class="token punctuation">:</span>
            <span class="token comment"># 手机号字段存储的密文字段，这个是数据库中真实存在的字段</span>
            <span class="token key atrule">cipherColumn</span><span class="token punctuation">:</span> phone
            <span class="token comment"># 身份证字段加密算法</span>
            <span class="token key atrule">encryptorName</span><span class="token punctuation">:</span> common_encryptor
          <span class="token key atrule">mail</span><span class="token punctuation">:</span>
            <span class="token key atrule">cipherColumn</span><span class="token punctuation">:</span> mail
            <span class="token key atrule">encryptorName</span><span class="token punctuation">:</span> common_encryptor
        <span class="token comment"># 是否按照密文字段查询</span>
        <span class="token key atrule">queryWithCipherColumn</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token comment"># 加密算法</span>
    <span class="token key atrule">encryptors</span><span class="token punctuation">:</span>
      <span class="token comment"># 自定义加密算法名称</span>
      <span class="token key atrule">common_encryptor</span><span class="token punctuation">:</span>
        <span class="token comment"># 加密算法类型</span>
        <span class="token key atrule">type</span><span class="token punctuation">:</span> AES
        <span class="token key atrule">props</span><span class="token punctuation">:</span>
          <span class="token comment"># AES 加密密钥</span>
          <span class="token key atrule">aes-key-value</span><span class="token punctuation">:</span> d6oadClrrb9DFESA
<span class="token key atrule">props</span><span class="token punctuation">:</span>
  <span class="token key atrule">sql-show</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),p=[l];function c(i,o){return s(),a("div",null,p)}const r=n(t,[["render",c],["__file","4.Encrypted storage of sensitive data.html.vue"]]);export{r as default};
