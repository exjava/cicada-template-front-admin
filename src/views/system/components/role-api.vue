<template>
  <div>
    <div class="filter-container">
      <el-input v-model="roleApiListQuery.apiName" size="small" :placeholder="$t('system.api.apiName')" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="getRoleApiList">
        {{ $t('common.button.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="small" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        {{ $t('common.button.add') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="small" type="danger" icon="el-icon-delete" @click="deleteRoleApis">
        {{ $t('common.button.delete') }}
      </el-button>
    </div>
    <el-table
      v-loading="roleApiListLoading"
      stripe
      :data="roleApiList"
      size="small"
      border
      fit
      highlight-current-row
      height="400"
      style="width: 100%"
      @selection-change="handleRoleApiSelectionChange"
      @sort-change="sortRoleApiChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" :label="$t('system.api.apiId')" width="100" prop="apiId" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.api.apiId }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" :label="$t('system.api.apiName')" prop="apiName" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.api.apiName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" :label="$t('system.api.apiType')">
        <template slot-scope="{row}">
          <span>{{ row.api.apiType=='0'?'REST':'' }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" :label="$t('system.api.requestUrl')">
        <template slot-scope="{row}">
          <span>{{ row.api.requestUrl }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" :label="$t('system.api.requestMethod')">
        <template slot-scope="{row}">
          <span>{{ row.api.requestMethod }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.label.action')" width="110">
        <template slot-scope="{row}">
          <el-popconfirm
            :title="$t('confirm.messageDelete')"
            :confirm-button-text="$t('confirm.btnOk')"
            :cancel-button-text="$t('confirm.btnCancel')"
            @onConfirm="deleteRoleApi(row.roleApiId)"
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
    <pagination v-show="roleApiTotal>0" :total="roleApiTotal" :page.sync="roleApiListQuery.pageNumber" :limit.sync="roleApiListQuery.pageSize" @pagination="getRoleApiList" />
    <el-dialog :title="$t('system.role.roleApiAdd')" :visible.sync="dialogApiVisible" width="60%" append-to-body>
      <div class="filter-container">
        <el-input v-model="apiListQuery.apiName" size="small" :placeholder="$t('system.api.apiName')" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" size="small" icon="el-icon-search" @click="getApiList">
          {{ $t('common.button.search') }}
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" size="small" type="success" icon="el-icon-check" @click="addRoleApis">
          {{ $t('common.button.submit') }}
        </el-button>
      </div>
      <el-table
        v-loading="apiListLoading"
        stripe
        :data="apiList"
        size="small"
        border
        fit
        highlight-current-row
        height="350"
        style="width: 100%"
        @selection-change="handleApiSelectionChange"
        @sort-change="sortApiChange"
      >
        <el-table-column align="center" type="selection" width="50" :selectable="canSelect" />
        <el-table-column align="center" :label="$t('system.api.apiId')" width="100" prop="apiId" sortable="custom">
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

        <el-table-column align="center" :label="$t('common.label.action')" width="110">
          <template slot-scope="{row}">
            <template v-if="!row.exist">
              <el-button
                slot="reference"
                type="success"
                round
                size="mini"
                icon="el-icon-circle-plus-outline"
                @click="addRoleApi(row.apiId)"
              >
                {{ $t('common.button.add') }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="apiTotal>0" :total="apiTotal" :page.sync="apiListQuery.pageNumber" :limit.sync="apiListQuery.pageSize" @pagination="getApiList" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/system/system-api'
import { fetchList as fetchApiRoleList, deleteRoleApis, addRoleApis } from '@/api/system/system-role-api'
import Pagination from '@/components/Pagination'

export default {
  name: 'RoleApi',
  components: { Pagination },
  props: {
    roleId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      roleApiTotal: 0,
      roleApiList: null,
      roleApiListLoading: true,
      roleApiListQuery: {
        roleId: 0,
        apiName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      },
      selectedRoleApis: [],
      apiTotal: 0,
      apiList: null,
      apiListLoading: true,
      apiListQuery: {
        apiName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      },
      selectedApis: [],
      dialogApiVisible: false
    }
  },
  watch: {
    roleId() {
      this.resetRoleApiListQuery()
      this.getRoleApiList()
    }
  },
  created() {
    this.getRoleApiList()
  },
  methods: {
    canSelect(row, index) {
      if (!row.exist) {
        return true
      }
      return false
    },
    resetRoleApiListQuery() {
      this.roleApiListQuery = {
        roleId: 0,
        apiName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      }
    },
    resetApiListQuery() {
      this.apiListQuery = {
        apiName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      }
    },
    handleRoleApiSelectionChange(val) {
      this.selectedRoleApis = val
    },
    handleApiSelectionChange(val) {
      this.selectedApis = val
    },
    handleCreate() {
      this.selectedApis = []
      this.resetApiListQuery()
      this.dialogApiVisible = true
      this.getApiList()
    },
    getRoleApiList() {
      this.roleApiListLoading = true
      this.roleApiListQuery.roleId = this.roleId
      fetchApiRoleList(this.roleApiListQuery).then((response) => {
        const data = response.data
        this.roleApiTotal = data.total
        this.roleApiList = data.records
        this.roleApiListLoading = false
      }).catch(() => {
        this.roleApiListLoading = false
      })
    },
    deleteRoleApis() {
      if (this.selectedRoleApis.length < 1) {
        return
      }
      this.$confirm(this.$t('confirm.messageDelete'), this.$t('confirm.title'), {
        confirmButtonText: this.$t('confirm.btnOk'),
        cancelButtonText: this.$t('confirm.btnCancel'),
        type: 'warning'
      }).then(() => {
        const requestParams = {
          roleApiIds: []
        }
        this.selectedRoleApis.forEach(item => {
          requestParams.roleApiIds.push(item.roleApiId)
        })
        deleteRoleApis(requestParams).then(() => {
          this.$message({
            message: this.$t('message.dataDeleteSuccess'),
            type: 'success'
          })
          this.getRoleApiList()
        }).catch(() => {
          this.getRoleApiList()
        })
      })
    },
    deleteRoleApi(roleApiId) {
      const requestParams = {
        roleApiIds: []
      }
      requestParams.roleApiIds.push(roleApiId)
      deleteRoleApis(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataDeleteSuccess'),
          type: 'success'
        })
        this.getRoleApiList()
      }).catch(() => {
        this.getRoleApiList()
      })
    },
    sortRoleApiChange(data) {
      const { prop, order } = data
      this.roleApiListQuery.orderBy = []
      if (order === 'ascending') {
        this.roleApiListQuery.orderBy.push(prop)
      } else if (order === 'descending') {
        this.roleApiListQuery.orderBy.push(prop + ' desc')
      }
      this.getRoleApiList()
    },
    getApiList() {
      this.apiListLoading = true
      fetchList(this.apiListQuery).then((response) => {
        const data = response.data
        this.apiTotal = data.total

        const items = data.records
        this.apiList = items.map(v => {
          let alreadyExist = false
          this.roleApiList.some(r => {
            if (r.api.apiName === v.apiName) {
              alreadyExist = true
            }
          })
          this.$set(v, 'exist', alreadyExist)
          v.originalValues = v
          return v
        })
        this.apiListLoading = false
      }).catch(() => {
        this.apiListLoading = false
      })
    },
    sortApiChange(data) {
      const { prop, order } = data
      this.apiListQuery.orderBy = []
      if (order === 'ascending') {
        this.apiListQuery.orderBy.push(prop)
      } else if (order === 'descending') {
        this.apiListQuery.orderBy.push(prop + ' desc')
      }
      this.getApiList()
    },
    addRoleApis() {
      if (this.selectedApis.length < 1) {
        return
      }
      const requestParams = {
        roleApis: []
      }
      this.selectedApis.forEach(item => {
        const apiRole = {
          roleId: this.roleId,
          apiId: item.apiId
        }
        requestParams.roleApis.push(apiRole)
      })
      addRoleApis(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataAddSuccess'),
          type: 'success'
        })
        this.getRoleApiList()
        this.dialogApiVisible = false
      }).catch(() => {
        this.getApiList()
      })
    },
    addRoleApi(apiId) {
      const requestParams = {
        roleApis: []
      }
      const apiRole = {
        apiId: apiId,
        roleId: this.roleId
      }
      requestParams.roleApis.push(apiRole)
      addRoleApis(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataAddSuccess'),
          type: 'success'
        })
        this.getRoleApiList()
        this.dialogApiVisible = false
      }).catch(() => {
        this.getApiList()
      })
    }
  }
}
</script>

<style scoped>

</style>
