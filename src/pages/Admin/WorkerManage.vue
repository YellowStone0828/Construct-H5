<template>
  <div>
    <div class="topToolBar">
      <a-button class="btn_success" @click="showAddNew">新增</a-button>
    </div>
    <div class="searchArea">
      <a-form-model ref="searchForm" :model="searchData">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="姓名" prop="name" :labelCol="{span:3}" :wrapperCol="{span:17}">
              <a-input v-model="searchData.name"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="10">
            <a-form-model-item label="身份证号码" prop="idNo" :labelCol="{span:4}" :wrapperCol="{span:16}">
              <a-input v-model="searchData.idNo"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div class="searchButtonArea">
        <a-button class="searchButton" @click="findData">
          查找员工
        </a-button>
      </div>
    </div>
    <div class="contentGrid">
    <a-table bordered
             :row-key="record => record.id"
             :data-source="tbMainData"
             :columns="tbMainHead"
             :pagination="pagination"
             :customRow="rowClick"
             @change="handleTableChange">

      <img class="tableImg" :onerror="$global.defaultImg" slot="pic" slot-scope="text" :src="text"/>
    </a-table>
    </div>
    <a-drawer title="编辑" width="50%" destroyOnClose :visible="isDrawerShow" @close="isDrawerShow=false">

      <a-form-model ref="checkForm" :model="formData" :rules="formRule">

<!--        <a-row >-->
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
<!--          <a-col >-->
<!--            <a-row type="flex" align="left">-->
<!--              <a-col >-->
<!--                <a-form-model-item label="昵称" prop="NickName" :labelCol="{span:4}" :wrapperCol="{span:20}">-->
<!--                  <a-input v-model="formData.NickName"/>-->
<!--                </a-form-model-item>-->
<!--              </a-col>-->
<!--              <a-col :span="100">-->
                <a-form-model-item label="姓名" prop="name" :labelCol="{span:3}" :wrapperCol="{span:10}">
                  <a-input v-model="formData.name" />
                </a-form-model-item>
<!--              </a-col>-->
<!--            </a-row>-->
<!--          </a-col>-->

<!--        </a-row>-->
<!--        <a-row>-->
          <a-form-model-item label="身份证号码" prop="idNo" :labelCol="{span:3}" :wrapperCol="{span:15}">
                          <a-input v-model="formData.idNo"/>
                        </a-form-model-item>
<!--        </a-row>-->
<!--        <a-row type="flex" justify="space-between">-->
<!--        <a-col :span="100">-->
<!--        <a-row type="flex" align="left">-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="身份证号码" prop="IdNo" :labelCol="{span:5}" :wrapperCol="{span:20}">-->
<!--              <a-input v-model="formData.idNo"/>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--&lt;!&ndash;          <a-col :span="11">&ndash;&gt;-->
<!--&lt;!&ndash;            <a-form-model-item label="邮箱">&ndash;&gt;-->
<!--&lt;!&ndash;              <a-input v-model="formData.Email"/>&ndash;&gt;-->
<!--&lt;!&ndash;            </a-form-model-item>&ndash;&gt;-->
<!--&lt;!&ndash;          </a-col>&ndash;&gt;-->
<!--        </a-row>-->
<!--        </a-col>-->
<!--&lt;!&ndash;        <a-row type="flex" justify="space-between">&ndash;&gt;-->
<!--&lt;!&ndash;          <a-col :span="11">&ndash;&gt;-->
<!--&lt;!&ndash;            <a-form-model-item label="生日">&ndash;&gt;-->
<!--&lt;!&ndash;              <a-date-picker valueFormat="YYYY-MM-DD" v-model="formData.Birthdate"/>&ndash;&gt;-->
<!--&lt;!&ndash;            </a-form-model-item>&ndash;&gt;-->
<!--&lt;!&ndash;          </a-col>&ndash;&gt;-->
<!--&lt;!&ndash;          <a-col :span="11">&ndash;&gt;-->
<!--&lt;!&ndash;            <a-form-model-item label="性别">&ndash;&gt;-->
<!--&lt;!&ndash;              <a-radio-group v-model="formData.Sex">&ndash;&gt;-->
<!--&lt;!&ndash;                <a-radio :value="1">男</a-radio>&ndash;&gt;-->
<!--&lt;!&ndash;                <a-radio :value="2">女</a-radio>&ndash;&gt;-->
<!--&lt;!&ndash;              </a-radio-group>&ndash;&gt;-->
<!--&lt;!&ndash;            </a-form-model-item>&ndash;&gt;-->
<!--&lt;!&ndash;          </a-col>&ndash;&gt;-->
<!--&lt;!&ndash;        </a-row>&ndash;&gt;-->
<!--&lt;!&ndash;        <a-form-model-item label="地址">&ndash;&gt;-->
<!--&lt;!&ndash;          <a-input v-model="formData.OrgAddress"/>&ndash;&gt;-->
<!--&lt;!&ndash;        </a-form-model-item>&ndash;&gt;-->
<!--        </a-row>-->
      </a-form-model>

      <div class="drawerFoot">
        <div class="footFixedArea">
          <a-button @click="isDrawerShow=false">
            取消
          </a-button>
          <a-button type="primary" @click="submitData" v-show="isAdmin">
            提交
          </a-button>
          <a-button type="danger" @click="deleteData" v-show="isAdmin && formData.id">
            删除
          </a-button>
        </div>
      </div>
    </a-drawer>

  </div>
</template>

<script>

import {mapState} from "vuex";
import commonConstants from "../../constants/commonConstants";

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
        current: commonConstants.pagination.page,
        pageSize: commonConstants.pagination.size,
        total: 0,
        simple: true
      },
      formData: {
        id: '',
        name: '',
        idNo: '',
      },
      searchData: {
        name: '',
        idNo: ''
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
          let a = this.formData;
          const url = this.formData.id ? 'worker/update' : 'worker/create';
          this.$http.postHttp(url, this.formData, (res) => {
            this.$global.toast('提交成功');
            this.getData(this.pagination.current - 1);
          })
          console.log(this.formData);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    deleteData() {
      const self = this;
      this.$confirm({
        title: '确认删除?',
        content: h => <div style="color:red;">你确认要删除该员工么？</div>,
        onOk() {
          self.$http.postHttp(`worker/delete/${self.formData.id}`, {}, (res) => {
            self.$global.toast('删除成功');
            self.getData(self.pagination.current - 1);
          })
        },
        onCancel() {
        },
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
      console.log("param", page, size, this.searchData.idNo);
      this.$http.getHttp(`worker/find?page=${page}&size=${size}&name=${this.searchData.name}&idNo=${this.searchData.idNo}`, {}, (res) => {
        console.log("返回结果", res);
        if (res.data) {
          this.pagination.total = res.data.totalElements;
          this.pagination.current = page + 1;
          this.pagination.pageSize = size;
          this.tbMainData = res.data.content;
        }

      })
    },
    findData(event, page, size) {
      this.getData(page, size)
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
  name: [{
    required: true,
    message: "姓名不能为空",
    trigger: 'blur'
  }, {
    min: 2,
    max: 5,
    message: '姓名长度需在2到5个字符',
    trigger: 'blur'
  },
  ],
  idNo: [{
    required: true,
    message: "身份证号码不能为空",
    trigger: 'blur'
  }],
}
const tbMainHead = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '身份证号码',
    dataIndex: 'idNo',
  }
];

</script>

<style lang="scss" scoped>
.moduleAll {
}
</style>
