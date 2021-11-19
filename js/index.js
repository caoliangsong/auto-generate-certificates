(function () {
  let options = {
    el: "#app",
    data: {
      username: "",
      datetime: "",
      hasCert: false,
      img: "",
      percent: 20,
    },
    created() {
      // 预加载模板图3M
      const self = this;
      let image = new Image();
      image.src = "./img/demo.png";
      image.onload = function (r) {
        self.percent = 100;
      };
      this.img = image;
    },
    methods: {
      onGenerateHandle() {
        if (!this.username || !this.datetime) {
          return alert("请输入姓名或日期");
        }
        this.img2Canvas();
      },
      img2Canvas() {
        this.hasCert = true;
        let canvas = document.getElementById("myCanvas");
        canvas.width = 500;
        canvas.height = 750;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(this.img, 0, 0, 500, 750);
        this.watermark(canvas, 103, 168, 150, 400, false).then((res) => {
          console.log(res);
        });
      },
      onDownloadHandle() {
        if (!this.username || !this.datetime) {
          return alert("请输入姓名或日期");
        }
        let canvas = document.createElement("canvas");
        // let canvas = document.getElementById("myCanvas2");
        canvas.width = this.img.width;
        canvas.height = this.img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(this.img, 0, 0);
        this.watermark(canvas, 103, 168, 150, 400, true).then((res) => {
          console.log(res);
          var a = document.createElement("a");
          var url = window.URL.createObjectURL(res);
          a.download = `${this.username}-明康汇结业证书.png`;
          a.href = url;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      },

      watermark(canvas, x, y, x1, y1, isDownLoad = false) {
        return new Promise((resolve, reject) => {
          let ctx = canvas.getContext("2d");
          ctx.font = isDownLoad ? `${12 * 7}px 楷体` : `12px 楷体`;
          ctx.fillStyle = "#545453";
          ctx.textAlign = "left";
          ctx.fillText(
            this.datetime,
            isDownLoad ? x * 7 : x,
            canvas.height - (isDownLoad ? y * 7 : y)
          );

          ctx.font = isDownLoad ? `${60 * 7}px 楷体` : `60px 楷体`;
          ctx.fillStyle = "#545453";
          ctx.textAlign = "left";
          ctx.fillText(
            this.username,
            isDownLoad ? x1 * 7 : x1,
            isDownLoad ? y1 * 7 : y1
          );
          canvas.toBlob((blob) => resolve(blob));
        });
      },

      onImportHandle(e) {
        console.log(e.target.files);
        const self = this;
        const { files } = e.target;
        if (files.length > 0) {
          const f = files[0];
          let reader = new FileReader();
          reader.readAsBinaryString(f);
          reader.onload = function (res) {
            let data = res.target.result;
            let workbook = XLSX.read(data, { type: "binary" });
            var sheetNames = workbook.SheetNames; // 工作表名称集合
            let allNames = [];
            let datetime = "";
            sheetNames.forEach((name) => {
              var worksheet = workbook.Sheets[name]; // 只能通过工作表名称来获取指定工作表
              console.log("worksheet", worksheet);
              for (var key in worksheet) {
                // .v是读取单元格的原始值,.t是单元格内容类型,.f是单元公式  !开头是有合并,c是列r是行(从0开始算)
                // 读取日期
                if (key == "C3") {
                  const t = worksheet[key].w.split("/");
                  datetime = `20${t[2]}-${t[0]}-${t[1]}`;
                }

                if (key.indexOf("B") > -1 && key.slice(1) > 3) {
                  allNames.push(worksheet[key].v);
                }
                console.log(
                  key,
                  key[0] === "!" ? worksheet[key] : worksheet[key].v
                );
              }
            });

            self.datetime = datetime;
            for (let i = 0; i < allNames.length; i++) {
              (function (j) {
                setTimeout(() => {
                  self.username = allNames[j];
                  self.onDownloadHandle();
                }, j * 2000);
              })(i);
            }
          };
        }
      },
    },
  };
  window.app = new Vue(options);
  console.log(window.app);
})();
