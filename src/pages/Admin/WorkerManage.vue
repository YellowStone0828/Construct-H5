<template>
  <div>
    <div class="topToolBar">
      <a-button class="btn_success" @click="showAddNew">新增</a-button>
      <!-- <a-button type="primary" icon="import">导入</a-button> -->
    </div>
    <a-table bordered
             :row-key="record => record.id"
             :data-source="tbMainData"
             :columns="tbMainHead"
             :pagination="pagination"
             :customRow="rowClick"
             @change="handleTableChange">

      <img class="tableImg" :onerror="$global.defaultImg" slot="pic" slot-scope="text" :src="text"/>
    </a-table>
    <a-drawer title="编辑" width="50%" destroyOnClose :visible="isDrawerShow" @close="isDrawerShow=false">

      <a-form-model ref="checkForm" :model="formData" :rules="formRule">

        <a-row type="flex" justify="space-between">
<!--          <a-col :span="10">-->
<!--            <a-upload-->
<!--                :action="$global.uploadUrl"-->
<!--                list-type="picture-card"-->
<!--                :file-list="previewImgList"-->
<!--                @preview="isImgPreview=true"-->
<!--                @change="changeImage">-->
<!--              <div v-if="previewImgList.length < 1">-->
<!--                <a-icon type="plus"/>-->
<!--                <div class="ant-upload-text">-->
<!--                  上传-->
<!--                </div>-->
<!--              </div>-->
<!--            </a-upload>-->
<!--            <a-modal :visible="isImgPreview" :closable="false" :footer="null" @cancel="isImgPreview=false">-->
<!--              <img alt="预览图片失败" class="wid100" :src="formData.AvatarUrl"/>-->
<!--            </a-modal>-->
<!--          </a-col>-->
          <a-col :span="13">
            <a-row type="flex" align="middle">
<!--              <a-col :span="24" :flex="1">-->
<!--                <a-form-model-item label="昵称" prop="NickName" :labelCol="{span:4}" :wrapperCol="{span:20}">-->
<!--                  <a-input v-model="formData.NickName"/>-->
<!--                </a-form-model-item>-->
<!--              </a-col>-->
              <a-col :span="24">
                <a-form-model-item label="姓名" prop="UserName" :labelCol="{span:4}" :wrapperCol="{span:20}">
                  <a-input v-model="formData.name" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>

        </a-row>
<!--        <a-row type="flex" justify="space-between">-->
        <a-col :span="13">
        <a-row type="flex" align="middle">
          <a-col :span="24">
            <a-form-model-item label="身份证" prop="TelephoneNumber" :labelCol="{span:4}" :wrapperCol="{span:20}">
              <a-input v-model="formData.idNo"/>
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="11">-->
<!--            <a-form-model-item label="邮箱">-->
<!--              <a-input v-model="formData.Email"/>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
        </a-row>
        </a-col>
<!--        <a-row type="flex" justify="space-between">-->
<!--          <a-col :span="11">-->
<!--            <a-form-model-item label="生日">-->
<!--              <a-date-picker valueFormat="YYYY-MM-DD" v-model="formData.Birthdate"/>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="11">-->
<!--            <a-form-model-item label="性别">-->
<!--              <a-radio-group v-model="formData.Sex">-->
<!--                <a-radio :value="1">男</a-radio>-->
<!--                <a-radio :value="2">女</a-radio>-->
<!--              </a-radio-group>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--        </a-row>-->
<!--        <a-form-model-item label="地址">-->
<!--          <a-input v-model="formData.OrgAddress"/>-->
<!--        </a-form-model-item>-->
      </a-form-model>

      <div class="drawerFoot">
        <div class="footFixedArea">
          <a-button @click="isDrawerShow=false">
            取消
          </a-button>
          <a-button type="primary" @click="submitData" v-show="isAdmin">
            提交
          </a-button>
          <a-button type="danger" @click="submitData" v-show="isAdmin">
            删除
          </a-button>
        </div>
      </div>
    </a-drawer>

  </div>
</template>

<script>

import {mapState} from "vuex";

export default {
  computed: {
    ...mapState([
      'isAdmin',
    ]),
  },
  data() {
    return {
      tbMainData: [],
      tbMainHead,
      formRule,
      isDrawerShow: false,
      isImgPreview: false,
      previewImgList: [],
      pagination: {
        current: this.$store.state.pagination.page,
        pageSize: 1,//this.$store.state.pagination.size,
        total: 0,
        simple: true
      },
      formData: {
        name: '',
        idNo: '',
      }
    }
  },
  mounted() {
    this.getData();
    this.tbMainHead.push();
  },
  methods: {
    submitData() {
      this.$refs.checkForm.validate(valid => {
        if (valid) {
          this.$global.toast('提交成功')
          console.log(this.formData);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current - 1;
      this.pagination = pager;
      this.getData(pager.current);
    },
    getData(page = 0, size = this.pagination.pageSize) {
      this.$http.getHttp(`worker/find?page=${page}&size=${size}`, {}, (res) => {
        console.log("返回结果", res);
        if (res.data) {
          //因为接口不开放了，我们假设数据如下
          this.pagination.total = res.data.totalElements;
          this.pagination.current = page + 1;
          this.pagination.pageSize = size;
          this.tbMainData = res.data.content;
        }

      })
    },
    showAddNew() {
      this.formData = {};
      this.previewImgList = [];
      this.isDrawerShow = true;
    },
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            console.log('查看', record)
            this.formData = {...record};
            if (this.formData.AvatarUrl) {
              this.previewImgList = [{
                uid: '-1',
                name: 'Photo',
                status: 'done',
                url: this.formData.AvatarUrl,
              }]
            } else {
              this.previewImgList = []
            }
            this.isDrawerShow = true;
          }
        }
      }
    },
    changeImage(e) {
      // console.log(2,e);
      let status = e.file.status
      if (status == "removed") {
        this.previewImgList = []
      } else if (status == "done") {
        this.formData.AvatarUrl = e.file.response.data;
        this.$global.toast('需自行配置上传地址', 'error')
        // 要配置action的那个地址,方可上传成功
      } else {
        this.previewImgList = e.fileList;
      }
    }
  }
}
const formRule = {
  NickName: [{
    required: true,
    message: "昵称不能为空",
    trigger: 'change'
  }],
  UserName: [{
    required: true,
    message: "用户名不能为空",
    trigger: 'blur'
  },
    {
      min: 2,
      max: 5,
      message: '姓名长度需在2到5个字符',
      trigger: 'blur'
    },
  ],
  TelephoneNumber: [{
    required: true,
    message: "手机号不能为空",
    trigger: 'change'
  }],
}
const tbMainHead = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '身份证',
    dataIndex: 'idNo',
  }
];

</script>

<style lang="scss" scoped>
.moduleAll {
}
</style>
