<template>
  <div>
    <!-- 排序輸入框 -->
    <div v-if="hasSort">
      <span v-for="(item, index) in imgs" :key="index">
        <el-input-number
          class="sort-input"
          size="mini"
          v-model="item.sort"
          style="margin: 0 12px;"
          :min="1"
          :max="limit"
          :key="index"
        >
        </el-input-number>
      </span>
    </div>

    <!-- 上傳圖片牆 -->
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      ref="uploadImg"
      accept="image/*"
      :auto-upload="false"
      :http-request="imageUpload"
      :show-file-list="true"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :on-exceed="uploadOverrun"
      :file-list="imgs"
      :limit="limit"
      id="img-list"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <!-- 圖片放大顯示彈跳窗 -->
    <el-dialog :visible.sync="dialogVisible" :v-model="imgs" top="5vh">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>

    <!-- 圖片剪裁器 -->
    <el-dialog
      class="cropper"
      title="剪裁圖片"
      :visible.sync="cropDialogVisible"
      width="80vw"
      top="5vh"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <cropper
        ref="cropper"
        :img-file="cropOption.img"
        :fixed-number="cropOption.fixedNumber"
        :auto-crop-width="cropOption.autoCropWidth"
        :auto-crop-height="cropOption.autoCropHeight"
        @upload="imageUpload"
      >
      </cropper>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getFileNum: 0,
      dialogImageUrl: "",
      dialogVisible: false,
      cropDialogVisible: false,
      cropOption: {
        img: "",
        autoCropWidth: this.autoCropWidth,
        autoCropHeight: this.autoCropHeight,
        fixedNumber: this.fixedNumber,
      },
      imgs: this.imgList,
    };
  },
  props: {
    imgList: {
      type: Array,
      required: true,
    },
    getId: {
      type: String,
      required: true,
    },
    fixedNumber: {
      type: Array,
      required: true,
    },
    autoCropWidth: {
      type: Number,
      required: true,
    },
    autoCropHeight: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      default: 5,
    },
    imgType: {
      type: Array,
    },
    imgSize: {
      type: Number,
    },
    hasSort: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // 圖片牆數量不為零時依照圖片比例及數量調整顯示
    var img = document.getElementById(this.getId);
    var card = img.getElementsByClassName("el-upload--picture-card")[0];

    this.getFileNum = this.imgList.length;
    if (this.imgList.length >= this.limit) {
      card.classList.add("img-overrun");
    }

    if (this.fixedNumber) {
      var val = this.fixedNumber[1] / this.fixedNumber[0];
      var upload = document.getElementById(this.getId);
      var items = upload.getElementsByClassName("el-upload-list__item");

      card.style.height = 148 * val + "px";
      card.style.lineHeight = 146 * val + 15 + "px";

      Array.from(items).forEach(function (element) {
        element.style.height = 146 * val + "px";
      });
    }
  },
  methods: {
    // 超過上傳張數上限
    uploadOverrun() {
      this.getFileNum = this.limit;
      this.$message.error("最多僅能上傳" + this.limit + "張圖片");
    },
    // 圖片上傳時驅動
    imageUpload(file, url, uid) {
      this.getFileNum += 1;
      this.cropDialogVisible = false;
      this.imgs.push({
        file: file,
        url: url,
        sort: this.getFileNum,
      });
      
      // 超出圖片數量上限時刪除圖片牆超出項目
      if (this.getFileNum >= this.limit) {
        let img = document.getElementById(this.getId);
        let card = img.getElementsByClassName("el-upload--picture-card")[0];

        card.classList.add("img-overrun");
      }

      // 圖片顯示比例
      if (this.fixedNumber) {
        let val = this.fixedNumber[1] / this.fixedNumber[0];
        let upload = document.getElementById(this.getId);
        let items = upload.getElementsByClassName("el-upload-list__item");

        Array.from(items).forEach(function (element) {
          element.style.height = 146 * val + "px";
        });
      }

      this.$emit("upload", this.imgs);
    },
    // 移除圖片牆圖片
    handleRemove(file, fileList) {
      let index = this.imgs.findIndex((val) => val.uid === file.uid);
      this.getFileNum = fileList.length;

      if (index != -1) {
        this.imgs.splice(index, 1);
      }

      if (this.getFileNum < this.limit) {
        let img = document.getElementById(this.getId);
        let card = img.getElementsByClassName("el-upload--picture-card")[0];

        card.classList.remove("img-overrun");
      }
    },
    // 偵測到有圖片增減變動時檢查
    handleChange(file, fileList) {
      if (!file) return;

      // 圖片型態判斷
      if (this.imgType) {
        var isImgType = this.imgType.every(function (item) {
          switch (item.toLowerCase()) {
            case "jpg":
            case "jpeg":
              var type = "image/jpeg";
              break;
            case "png":
              var type = "image/png";
              break;
            case "gif":
              var type = "image/gif";
          }

          if (type && file.raw.type === type) {
            return item;
          }
        });
      }

      // 圖片大小判斷
      if (this.imgSize) {
        var isImgSize = file.size / 1024 / 1024 <= this.imgSize;
      }

      // 最終判斷是否通過(是否制定格式限制並符合)
      if (this.imgType && !isImgType) {
        let index = fileList.findIndex((val) => val.uid === file.uid);
        fileList.splice(index, 1);
        this.$message.error("上傳圖片格式錯誤!");
      } 
      else if (this.imgSize && !isImgSize) {
        let index = fileList.findIndex((val) => val.uid === file.uid);
        fileList.splice(index, 1);
        this.$message.error("上傳圖片大小不能大於" + this.imgSize + "MB!");
      } 
      else {
        this.cropDialogVisible = true;
        this.cropOption.img = file;
      }
    },
    // 圖片放大顯示
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>
<style>
.img-overrun {
  display: none !important;
}
</style>
