---
order: 6
author: 
title: "ES导错包"
category:
  - ES
  - 导错包


---

### 创建ES索引导错包：

`CreateIndexRequest`的包应该是`org.elasticsearch.client.RequestOptions`

```java
@SpringBootTest
public class HotelIndexTest {
    private RestHighLevelClient client;

    @Test
    void createHotelIndex() throws IOException {
        // 1.创建Request对象
        CreateIndexRequest request = new CreateIndexRequest("hotel");
        // 2.准备请求的参数：DSL语句
        request.source(MAPPING_TEMPLATE, XContentType.JSON);
        // 3.发送请求
        client.indices().create(request, RequestOptions.DEFAULT);
        System.out.println(client);
    }

    @BeforeEach
    void setUp() {
        this.client = new RestHighLevelClient(RestClient.builder(
                HttpHost.create("es-server:9200")
        ));
    }

    @AfterEach
    void tearDown() throws IOException {
        this.client.close();
    }
}
```











