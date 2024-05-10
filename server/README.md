<!-- #  -->
### Files
```
.
├── dev: các script cần cho quá trình phát triển
│   ├── dev.js: chạy server dev mode
│   ├── build.js: build server, client (build folder ./dist)
│   └── copy-shared.js: copy folder ./src/shared đến ../client/src/shared -> dùng cho dev mode 
├── data: thư mục data, khi build xong sẽ clone sang ./dist/data
└── src
    ├── setup.ts: setup config trước khi server chạy
    ├── app.ts: nơi script bắt đầu
    ├── model: chứa các model
    │   ├── ...
    │   ├── MovieTopRateSort: cache sort trước các bộ phim theo rating
    │   └── MovieTrendingSort: cache sort trước các bộ phim theo sự phổ biến
    ├── core
    │   ├── RestController.ts: Giúp tạo ra các requestHandler async
    │   └── RestControllerAPI.ts: API giúp các requestHandler được tạo từ RestController xử lí request dễ dàng hơn
    ├── common: chứa các constants, config
    ├── middleware: chứa các middleware
    │   └── auth-middleware.ts: xác thực người dùng
    ├── controllers: chứa các controller
    ├── shared: chứa các types model và api urls. được share qua cho client
    └── utils: chứa các hàm tiện ích
        ├── ...
        └── JSONSync.ts: đọc ghi file json 1 cách đồng bộ
```