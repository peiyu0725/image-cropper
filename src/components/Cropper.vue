<template>
  <div>
    <div class="cropper-content">
      <!-- 剪裁框 -->
      <div class="cropper">
        <vue-cropper
          ref="cropper"
          :img="imgFile.url"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="false" :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="autoCropWidth"
          :autoCropHeight="autoCropHeight"
          :fixedBox="option.fixedBox"
          @realTime="realTime"
          :fixed="option.fixed"
          :fixedNumber="fixedNumber"
          :center-box="option.centerBox"
          :enlarge="option.enlarge">
        </vue-cropper>
      </div>
    </div>

    <div class="footer-btn">
      <!-- 縮放旋轉按鈕 -->
      <div class="scope-btn">
        <el-button type="primary" icon="el-icon-zoom-in" @click="changeScale(1)"></el-button>
        <el-button type="primary" icon="el-icon-zoom-out" @click="changeScale(-1)"></el-button>
        <el-button type="primary" @click="rotateLeft">逆時針旋轉</el-button>
        <el-button type="primary" @click="rotateRight">順時針旋轉</el-button>
      </div>

      <!-- 確認上傳按鈕 -->
      <div class="upload-btn">
        <el-button type="danger" :disabled="btnDisable" @click="uploadImg('blob')">上傳</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      previews: {}, // 預覽
      option: {
        img: '', //裁剪圖片的位置
        size: 1, // 裁剪生成圖片的質量
        full: true, // 是否輸出原圖比例的截圖 選true生成的圖片會非常大
        outputType: 'png',
        canMove: true, // 上傳圖片是否可以移動
        original: false, // 上傳圖片按照原始比例渲染
        canMoveBox: true, // 截圖框能否拖動
        autoCrop: true, // 是否產生截圖框
        fixedBox: false, // 固定截圖框大小
        fixed: true, // 是否開啟截圖框寬高固定比例
        autoCropWidth: 512,
        autoCropHeight: 384,
        centerBox: true,
        fixedNumber: [4, 3],
        enlarge: 2
      },
      btnDisable: false
    }
  },
  props: {
    imgFile:{
      type: Object
    },
    fixedNumber:{
      type: Array
    },
    autoCropWidth:{
      type: Number
    },
    autoCropHeight:{
      type: Number
    }
  },
  methods: {
    // 圖片縮放
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 向左旋轉
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋轉
    rotateRight () {
      this.$refs.cropper.rotateRight();
    },
    // 實時預覽
    realTime (data) {
      this.previews = data;
      this.btnDisable = false;
    },
    // 將剪裁好的圖片回傳給父組件
    uploadImg (type) {
      let vm = this;
      vm.btnDisable = true;
      event.preventDefault()

      if (type === 'blob') {
        vm.$refs.cropper.getCropBlob(data => {
          let fileName = vm.imgFile.name.split(".");
          fileName = fileName[0]+'.png';
          let file = new File([data], fileName, {type: "image/png"});
          let img = window.URL.createObjectURL(data);

          vm.$emit('upload', file, img, vm.imgFile.uid);
        })
      } 
      else {
        vm.$refs.cropper.getCropData(data => {
          vm.$emit('upload', data);
        })
      }
    }
  }
}
</script>
<style>
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
  width: 100%;
}
.cropper-content .cropper {
  width: 100%;
  height: 60vh;
}
.cropper-content .show-preview {
  flex: 1;
  -webkit-flex: 1;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #cccccc;
  margin-left: 40px;
}
.preview {
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #cccccc;
}
.footer-btn {
  margin-top: 30px;
}
.footer-btn .scope-btn {
  display: inline-block;
  width: 77%;
  padding: 5px 0;
}
.footer-btn .upload-btn {
  display: inline-block;
  width: 18%;
  padding: 5px 0;
  text-align: right;
}
.footer-btn .btn {
  outline: none;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 8px 15px;
  font-size: 12px;
  border-radius: 3px;
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}
</style>
