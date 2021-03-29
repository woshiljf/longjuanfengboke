<template>
  <div>
    <el-upload
      v-if="FileType === 'picfile'"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :limit="limit"
      :on-exceed="onExceed"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      class="upload-demo"
      action=""
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <!--    上传图片,图片以列表的形式显示-->
    <el-upload
      v-if="FileType === 'picview'"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :limit="limit"
      :on-exceed="onExceed"
      :on-preview="handlePictureCardPreview"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="fileList"
      :before-upload="beforeAvatarUpload"
      action=""
      list-type="picture"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
    <!--    上传文件,文件类型显示-->
    <el-upload
      v-if="FileType === 'file'"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :limit="limit"
      :on-exceed="onExceed"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="fileList"
      :before-upload="beforeAvatarUpload"
      class="upload-demo"
      action=""
    >
      <el-button  size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">支持扩展名：rar.zip.doc.docx</div>
    </el-upload>
    <el-upload
      v-if="FileType === 'fileDrag'"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :limit="limit"
      :on-exceed="onExceed"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="fileList"
      :before-upload="beforeAvatarUpload"
      class="upload-demo"
      drag
      action=""
      multiple>
      <i class="el-icon-upload"/>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    limit: {
      type: Number,
      default: null
    },
    fileName: {
      type: String,
      default: 'file'
    },
    FileTypeList: {
      type: Array,
      default: () => []
    },
    FileType: { // 判断构建上传文件类型
      type: String,
      default: 'file'
    },
    FileTypeErrorText: {
        type: Array,
      default: () => []
    },
    FileLimit:{
       type: Number,
      default: 10
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      flag: true,
      dialogImageUrl: '',
      dialogVisible: false,
      formData: new FormData()
    }
  },
  methods: {
    fnOSSUpload(options) {
      console.log(this.fileName)
      this.formData.append(this.fileName, options.file)
      this.$emit('success', this.formData)
    },
    onSuccess(res, file, fileList) {
    },
    onRemove(file, fileList) {
      this.$emit('remove', file)
      this.flag = true
    },
    onError(err) {
      this.$message.error(err)
    },
    onExceed(files, fileList) {
      if (this.limit) {
        this.$message.warning(`当前限制选择${this.limit}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      }  
    },
    beforeRemove(file, fileList) {
      if (this.flag) {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeAvatarUpload(file) {
      // 获取文件名后缀
      const arr = file.name.split('.')
      const str = arr[arr.length - 1]
      // this.FileTypeList 为传进来的自定义文件内容, 过滤数组长度大于0,则证明存在
      const isFile = this.FileTypeList.filter(item => item.indexOf(str) > -1).length > 0
      // 先判断文件类型符不符合
      if (isFile) {
        // 再判断文件大小符不符合
        // 设置文件最大限制  , 以M为单位
        const isFileLimit = file.size / 1024 / 1024 < this.FileLimit
        if (isFileLimit) {
          return isFile && isFileLimit
        } else {
          // 如果文件大小不符合
          this.$message.warning(`${this.FileTypeErrorText[1]}`)
          this.flag = false
          return isFileLimit
        }
        
      } else {
        // 如果文件类型不符合, FileTypeErrorText 文件提示内容
        this.$message.warning(`${this.FileTypeErrorText[0]}`)
        this.flag = false
        return isFile
      }
    }
  }
}
</script>
