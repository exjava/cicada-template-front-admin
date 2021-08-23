<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.apiName" :placeholder="$t('system.api.apiName')" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('common.button.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        {{ $t('common.button.add') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteApis">
        {{ $t('common.button.delete') }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" stripe :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @sort-change="sortChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" :label="$t('system.api.apiId')" width="80" prop="apiId" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.apiId }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" :label="$t('system.api.apiName')" prop="apiName" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.apiName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" :label="$t('system.api.apiType')">
        <template slot-scope="{row}">
          <span>{{ row.apiType=='0'?'REST':'' }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" :label="$t('system.api.requestUrl')">
        <template slot-scope="{row}">
          <span>{{ row.requestUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" :label="$t('system.api.requestMethod')">
        <template slot-scope="{row}">
          <span>{{ row.requestMethod }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" :label="$t('system.api.role')">
        <template slot-scope="{row}">
          <el-button
            type="info"
            round
            size="small"
            icon="el-icon-set-up"
            @click="showApiRole(row)"
          >
            {{ $t('system.api.role') }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.label.action')" width="220">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            round
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(row.apiId)"
          >
            {{ $t('common.button.edit') }}
          </el-button>
          <el-popconfirm
            :title="$t('confirm.messageDelete')"
            :confirm-button-text="$t('confirm.btnOk')"
            :cancel-button-text="$t('confirm.btnCancel')"
            @onConfirm="deleteApi(row.apiId)"
          >
            <el-button
              slot="reference"
              type="danger"
              round
              size="small"
              icon="el-icon-delete"
            >
              {{ $t('common.button.delete') }}
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="temp.apiId?$t('system.api.formTitleEdit')+temp.apiId:$t('system.api.formTitleAdd')" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="apiForm" :rules="rules" :model="temp" label-position="right" label-width="100px">
        <el-form-item :label="$t('system.api.formApiName')" prop="apiName">
          <el-input v-model="temp.apiName" />
        </el-form-item>
        <el-form-item :label="$t('system.api.formApiType')" prop="apiType">
          <el-select v-model="temp.apiType" :placeholder="$t('system.api.requestMethodOption')">
            <el-option
              v-for="item in apiTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.api.formRequestUrl')" prop="requestUrl">
          <el-input v-model="temp.requestUrl" />
        </el-form-item>
        <el-form-item :label="$t('system.api.formRequestMethod')" prop="requestMethod">
          <el-select v-model="temp.requestMethod" :placeholder="$t('system.api.requestMethodOption')">
            <el-option
              v-for="item in requestMethodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.button.cancel') }}
        </el-button>
        <el-button type="primary" @click="saveApi">
          {{ $t('common.button.submit') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('system.api.apiRole')" :visible.sync="dialogApiRoleVisible" width="70%">
      <api-role :api-id="selectDetailApiId" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, editApi, addApi, deleteApis } from '@/api/system/system-api'
import Pagination from '@/components/Pagination'
import { stringValidator } from '@/validator/validator'
import { ApiRole } from './components'

export default {
  name: 'Api',
  components: { Pagination, ApiRole },
  data() {
    return {
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        apiName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      },
      temp: {
        apiName: '',
        requestUrl: '',
        requestMethod: '',
        apiType: ''
      },
      dialogFormVisible: false,
      dialogApiRoleVisible: false,
      selectDetailApiId: '',
      rules: {
        apiName: [{ required: true, trigger: 'blur', trim: true, max: 50, validator: stringValidator, fullField: this.$t('system.api.formApiName') }],
        apiType: [{ required: true, trigger: 'blur', trim: true, validator: stringValidator, fullField: this.$t('system.api.formApiType') }],
        requestUrl: [{ required: true, trigger: 'blur', trim: true, max: 100, validator: stringValidator, fullField: this.$t('system.api.formRequestUrl') }],
        requestMethod: [{ required: true, trigger: 'blur', trim: true, validator: stringValidator, fullField: this.$t('system.api.formRequestMethod') }]
      },
      selectedApis: [],
      requestMethodOptions: [{
        value: 'GET',
        label: 'GET'
      }, {
        value: 'POST',
        label: 'POST'
      }, {
        value: 'PUT',
        label: 'PUT'
      }, {
        value: 'DELETE',
        label: 'DELETE'
      }, {
        value: 'PATCH',
        label: 'PATCH'
      }],
      apiTypeOptions: [{
        value: '0',
        label: 'REST'
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.selectedApis = val
    },
    deleteApis() {
      if (this.selectedApis.length < 1) {
        return
      }
      this.$confirm(this.$t('confirm.messageDelete'), this.$t('confirm.title'), {
        confirmButtonText: this.$t('confirm.btnOk'),
        cancelButtonText: this.$t('confirm.btnCancel'),
        type: 'warning'
      }).then(() => {
        const requestParams = { apiIds: [] }
        this.selectedApis.forEach(item => {
          requestParams.apiIds.push(item.apiId)
        })
        deleteApis(requestParams).then(() => {
          this.$message({
            message: this.$t('message.dataDeleteSuccess'),
            type: 'success'
          })
          this.getList()
        }).catch(() => {
          this.getList()
        })
      })
    },
    deleteApi(apiId) {
      const requestParams = { apiIds: [] }
      requestParams.apiIds.push(apiId)
      deleteApis(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataDeleteSuccess'),
          type: 'success'
        })
        this.getList()
      }).catch(() => {
        this.getList()
      })
    },
    handleEdit(apiId) {
      this.resetTemp()
      const retrieveParam = {
        apiId: apiId
      }
      fetchList(retrieveParam).then((response) => {
        const data = response.data.records
        if (data.length && data.length > 0) {
          this.temp = data[0]
          this.dialogFormVisible = true
        } else {
          this.$message({
            message: this.$t('message.dataNotExist'),
            type: 'error'
          })
          this.getList()
        }
      }).catch(() => {
        this.getList()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
    },
    resetTemp() {
      this.temp = {
        apiName: '',
        requestUrl: '',
        requestMethod: '',
        apiType: ''
      }
      if (this.$refs['apiForm']) {
        this.$nextTick(() => {
          this.$refs['apiForm'].clearValidate()
        })
      }
    },
    saveApi() {
      this.$refs.apiForm.validate(valid => {
        if (valid) {
          if (this.temp.apiId) {
            editApi(this.temp).then(() => {
              this.$message({
                message: this.$t('message.dataEditSuccess'),
                type: 'success'
              })
              this.getList()
              this.dialogFormVisible = false
            }).catch(() => {

            })
          } else {
            addApi(this.temp).then(() => {
              this.$message({
                message: this.$t('message.dataAddSuccess'),
                type: 'success'
              })
              this.getList()
              this.dialogFormVisible = false
            }).catch(() => {

            })
          }
        }
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        const data = response.data
        this.total = data.total
        this.list = data.records
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      this.listQuery.orderBy = []
      if (order === 'ascending') {
        this.listQuery.orderBy.push(prop)
      } else if (order === 'descending') {
        this.listQuery.orderBy.push(prop + ' desc')
      }
      this.getList()
    },
    showApiRole(row) {
      this.selectDetailApiId = row.apiId
      this.dialogApiRoleVisible = true
    }
  }
}
</script>

<style scoped>

</style>
