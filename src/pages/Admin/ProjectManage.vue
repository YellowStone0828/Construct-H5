<template>
  <div>
    <div class="topToolBar">
      <a-button class="btn_success" @click="showAddNew">新增</a-button>
      <!-- <a-button type="primary" icon="import">导入</a-button> -->
    </div>
    <div class="searchArea">
      <a-form-model ref="searchForm" :model="searchData">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="项目名称" prop="name" :labelCol="{span:4}" :wrapperCol="{span:16}">
              <a-input v-model="searchData.name"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="10">
            <a-form-model-item label="地址" prop="address" :labelCol="{span:4}" :wrapperCol="{span:16}">
              <a-input v-model="searchData.address"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="省" prop="provinceCode" :labelCol="{span:4}" :wrapperCol="{span:16}">
            <a-select @change="handleProvinceChange" v-model="searchData.provinceCode">
              <a-select-option v-for="province in allProvinces" :key="province.code">
                {{ province.name }}
              </a-select-option>
            </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="10">
            <a-form-model-item label="市" prop="cityCode" :labelCol="{span:4}" :wrapperCol="{span:16}">
            <a-select v-model="searchData.cityCode">
              <a-select-option v-for="city in searchCities" :key="city.code">
                {{ city.name }}
              </a-select-option>
            </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div class="searchButtonArea">
        <a-button class="searchButton" @click="getData">
          查找项目
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
        <a-row>
          <a-col :span="20">
            <a-form-model-item label="项目名称" prop="name" :labelCol="{span:3}" :wrapperCol="{span:10}">
              <a-input v-model="formData.name"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20">
            <a-form-model-item label="省" prop="provinceCode" :labelCol="{span:3}" :wrapperCol="{span:10}">
              <a-select @change="handleAddProvinceChange" v-model="formData.provinceCode">
                <a-select-option v-for="province in allProvinces" :key="province.code">
                  {{ province.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20">
            <a-form-model-item label="市" prop="cityCode" :labelCol="{span:3}" :wrapperCol="{span:10}">
              <a-select v-model="formData.cityCode">
                <a-select-option v-for="city in addCities" :key="city.code">
                  {{ city.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20">
            <a-form-model-item label="项目地址" prop="address" :labelCol="{span:3}" :wrapperCol="{span:15}">
              <a-input v-model="formData.address"/>
            </a-form-model-item>
          </a-col>
        </a-row>
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
      allProvinces: [],
      searchCities: [],
      addCities: [],
      pagination: {
        current: commonConstants.pagination.page,
        pageSize: commonConstants.pagination.size,
        total: 0,
        simple: true
      },
      formData: {
        id: '',
        name: '',
        address: '',
        cityCode: null,
        provinceCode: null
      },
      searchData: {
        name: '',
        address: '',
        cityCode: null,
        provinceCode: null
      }
    }
  },
  mounted() {
    this.getAllProvinces();
    this.getData();
    this.tbMainHead.push();
  },
  methods: {
    getAllProvinces() {
      this.$http.getHttp(`province/findAll`, {}, (res) => {
        if (res.data) {
          this.allProvinces = res.data;
          this.allProvinces.unshift({
            code: '',
            name: '全国',
            city: [{
              code: null,
              name: ''
            }]
          })
        }
      })
    },
    handleProvinceChange(provinceCode) {
      let selectedProvince = this.allProvinces.find(p => p.code === provinceCode);
      this.searchCities = selectedProvince.cities;
      this.searchData.cityCode = null;
    },
    handleAddProvinceChange(provinceCode) {
      let selectedProvince = this.allProvinces.find(p => p.code === provinceCode);
      this.addCities = selectedProvince.cities;
      this.searchData.cityCode = null;
    },
    submitData() {
      this.$refs.checkForm.validate(valid => {
        if (valid) {
          const url = this.formData.id ? 'project/update' : 'project/create';
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
          self.$http.postHttp(`project/delete/${self.formData.id}`, {}, (res) => {
            self.$global.toast('删除成功');
            self.getData(self.pagination.current - 1);
          })
        },
        onCancel() {
        },
      });
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current - 1;
      this.pagination = pager;
      this.getData(null, pager.current);
    },
    getData(event, page = 0, size = this.pagination.pageSize) {
      let cityCodes = '';
      if (!this.searchData.cityCode && this.searchData.provinceCode) {
        this.searchCities.forEach(city => cityCodes = cityCodes + `&cityCodes=${city.code}`)
      } else if (this.searchData.cityCode) {
        cityCodes = `&cityCodes=${this.searchData.cityCode}`
      }
      this.$http.getHttp(`project/find?page=${page}&size=${size}${cityCodes}&name=${this.searchData.name}&address=${this.searchData.address}`, {}, (res) => {
        console.log("返回结果", res);
        if (res.data) {
          this.pagination.total = res.data.totalElements;
          this.pagination.current = page + 1;
          this.pagination.pageSize = size;
          let projects = res.data.content;
          projects.forEach(p => {
            p.cityName = p.city.name;
            p.provinceName = p.city.province.name;
            p.provinceCode = p.city.province.code;
          })
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
  name: [{
    required: true,
    message: "项目名称不能为空",
    trigger: 'blur'
  }],
  provinceCode: [{
    required: true,
    message: "所在省份不能为空",
    trigger: 'blur'
  }],
  cityCode: [{
    required: true,
    message: "所在城市不能为空",
    trigger: 'blur'
  }],
}
const tbMainHead = [
  {
    title: '项目名称',
    dataIndex: 'name',
  },
  {
    title: '省',
    dataIndex: 'provinceName',
  },
  {
    title: '市',
    dataIndex: 'cityName',
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
];

</script>

<style lang="scss" scoped>
.moduleAll {
}
</style>
