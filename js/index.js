(function () {
  let options = {
    el: "#app",
    data: {
      username: "",
      datetime: "",
      hasCert: false,
      img:''
    },
    methods: {
      onGenerateHandle() {
        if (!this.username || !this.datetime) {
          return alert("请输入姓名或日期");
        }
        this.img = document.getElementById("demo");
        this.img2Canvas()
      },
      img2Canvas() {
        this.hasCert = true
        let canvas = document.getElementById("myCanvas");
        canvas.width = 500;
        canvas.height = 750;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(this.img, 0, 0, 500, 750);
        this.watermark(canvas, 103, 168, 150, 400, false).then(res => {
          console.log(res)
        })
      },
      onDownloadHandle(){
        // let canvas = document.createElement("canvas");
        let canvas = document.getElementById("myCanvas2");
        canvas.width = this.img.width;
        canvas.height = this.img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(this.img, 0, 0);
        this.watermark(canvas, 103, 168, 150, 400, true).then(res => {
          console.log(res)
          var a = document.createElement('a')
          var url = window.URL.createObjectURL(res)
          a.download = `${this.username}.png`
          a.href = url
          a.click()
          window.URL.revokeObjectURL(url)
        })
      },

      watermark (canvas, x, y,x1,y1, isDownLoad = false) {
        return new Promise((resolve, reject) => {
          let ctx = canvas.getContext('2d')
          ctx.font = isDownLoad ? `${12 * 7}px 楷体` : `12px 楷体`
          ctx.fillStyle = "#545453"
          ctx.textAlign = 'left'
          ctx.fillText(this.datetime, isDownLoad ? x*7 :x, canvas.height - (isDownLoad ? y *7 : y))

           ctx.font = isDownLoad ? `${60 * 7}px 楷体` : `60px 楷体`
           ctx.fillStyle = "#545453"
           ctx.textAlign = 'left'
           ctx.fillText(this.username, isDownLoad ? x1*7 :x1, isDownLoad ? y1*7 :y1)
          canvas.toBlob(blob => resolve(blob))
        })
      }
    },
  };
  window.app = new Vue(options);
  console.log(window.app);
})();
