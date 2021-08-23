<template>
  <div>
    <div class="filter-container">
      <el-input v-model="apiRoleListQuery.rolePhysicalName" size="small" :placeholder="$t('system.role.rolePhysicalName')" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="getApiRoleList">
        {{ $t('common.button.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="small" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        {{ $t('common.button.add') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="small" type="danger" icon="el-icon-delete" @click="deleteApiRoles">
        {{ $t('common.button.delete') }}
      </el-button>
    </div>
    <el-table
      v-loading="apiRoleListLoading"
      stripe
      :data="apiRoleList"
      size="small"
      border
      fit
      highlight-current-row
      height="400"
      style="width: 100%"
      @selection-change="handleApiRoleSelectionChange"
      @sort-change="sortApiRoleChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" :label="$t('system.role.roleId')" width="100" prop="roleId" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.role.roleId }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" :label="$t('system.role.rolePhysicalName')" prop="rolePhysicalName" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.role.rolePhysicalName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" :label="$t('system.role.roleLogicalName')">
        <template slot-scope="{row}">
          <span>{{ row.role.roleLogicalName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.label.action')" width="110">
        <template slot-scope="{row}">
          <el-popconfirm
            :title="$t('confirm.messageDelete')"
            :confirm-button-text="$t('confirm.btnOk')"
            :cancel-button-text="$t('confirm.btnCancel')"
            @onConfirm="deleteApiRole(row.roleApiId)"
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
    <pagination v-show="apiRoleTotal>0" :total="apiRoleTotal" :page.sync="apiRoleListQuery.pageNumber" :limit.sync="apiRoleListQuery.pageSize" @pagination="getApiRoleList" />
    <el-dialog :title="$t('system.api.apiRoleAdd')" :visible.sync="dialogRoleVisible" width="60%" append-to-body>
      <div class="filter-container">
        <el-input v-model="roleListQuery.rolePhysicalName" size="small" :placeholder="$t('system.role.rolePhysicalName')" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" size="small" icon="el-icon-search" @click="getRoleList">
          {{ $t('common.button.search') }}
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" size="small" type="success" icon="el-icon-check" @click="addApiRoles">
          {{ $t('common.button.submit') }}
        </el-button>
      </div>
      <el-table
        v-loading="roleListLoading"
        stripe
        :data="roleList"
        size="small"
        border
        fit
        highlight-current-row
        height="350"
        style="width: 100%"
        @selection-change="handleRoleSelectionChange"
        @sort-change="sortRoleChange"
      >
        <el-table-column align="center" type="selection" width="50" :selectable="canSelect" />
        <el-table-column align="center" :label="$t('system.role.roleId')" width="100" prop="roleId" sortable="custom">
          <template slot-scope="{row}">
            <span>{{ row.roleId }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" :label="$t('system.role.rolePhysicalName')" prop="rolePhysicalName" sortable="custom">
          <template slot-scope="{row}">
            <span>{{ row.rolePhysicalName }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" :label="$t('system.role.roleLogicalName')">
          <template slot-scope="{row}">
            <span>{{ row.roleLogicalName }}</span>
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
                @click="addApiRole(row.roleId)"
              >
                {{ $t('common.button.add') }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="roleTotal>0" :total="roleTotal" :page.sync="roleListQuery.pageNumber" :limit.sync="roleListQuery.pageSize" @pagination="getRoleList" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/system/system-role'
import { fetchList as fetchApiRoleList, deleteRoleApis, addRoleApis } from '@/api/system/system-role-api'
import Pagination from '@/components/Pagination'

export default {
  name: 'ApiRole',
  components: { Pagination },
  props: {
    apiId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      apiRoleTotal: 0,
      apiRoleList: null,
      apiRoleListLoading: true,
      apiRoleListQuery: {
        apiId: 0,
        rolePhysicalName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      },
      selectedApiRoles: [],
      roleTotal: 0,
      roleList: null,
      roleListLoading: true,
      roleListQuery: {
        rolePhysicalName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      },
      selectedRoles: [],
      dialogRoleVisible: false
    }
  },
  watch: {
    apiId() {
      this.resetApiRoleListQuery()
      this.getApiRoleList()
    }
  },
  created() {
    this.getApiRoleList()
  },
  methods: {
    canSelect(row, index) {
      if (!row.exist) {
        return true
      }
      return false
    },
    resetApiRoleListQuery() {
      this.apiRoleListQuery = {
        apiId: 0,
        rolePhysicalName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      }
    },
    resetRoleListQuery() {
      this.roleListQuery = {
        rolePhysicalName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      }
    },
    handleApiRoleSelectionChange(val) {
      this.selectedApiRoles = val
    },
    handleRoleSelectionChange(val) {
      this.selectedRoles = val
    },
    handleCreate() {
      this.selectedRoles = []
      this.resetRoleListQuery()
      this.dialogRoleVisible = true
      this.getRoleList()
    },
    getApiRoleList() {
      this.apiRoleListLoading = true
      this.apiRoleListQuery.apiId = this.apiId
      fetchApiRoleList(this.apiRoleListQuery).then((response) => {
        const data = response.data
        this.apiRoleTotal = data.total
        this.apiRoleList = data.records
        this.apiRoleListLoading = false
      }).catch(() => {
        this.apiRoleListLoading = false
      })
    },
    deleteApiRoles() {
      if (this.selectedApiRoles.length < 1) {
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
        this.selectedApiRoles.forEach(item => {
          requestParams.roleApiIds.push(item.roleApiId)
        })
        deleteRoleApis(requestParams).then(() => {
          this.$message({
            message: this.$t('message.dataDeleteSuccess'),
            type: 'success'
          })
          this.getApiRoleList()
        }).catch(() => {
          this.getApiRoleList()
        })
      })
    },
    deleteApiRole(apiRoleId) {
      const requestParams = {
        roleApiIds: []
      }
      requestParams.roleApiIds.push(apiRoleId)
      deleteRoleApis(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataDeleteSuccess'),
          type: 'success'
        })
        this.getApiRoleList()
      }).catch(() => {
        this.getApiRoleList()
      })
    },
    sortApiRoleChange(data) {
      const { prop, order } = data
      this.apiRoleListQuery.orderBy = []
      if (order === 'ascending') {
        this.apiRoleListQuery.orderBy.push(prop)
      } else if (order === 'descending') {
        this.apiRoleListQuery.orderBy.push(prop + ' desc')
      }
      this.getApiRoleList()
    },
    getRoleList() {
      this.roleListLoading = true
      fetchList(this.roleListQuery).then((response) => {
        const data = response.data
        this.roleTotal = data.total

        const items = data.records
        this.roleList = items.map(v => {
          let alreadyExist = false
          this.apiRoleList.some(r => {
            if (r.role.rolePhysicalName === v.rolePhysicalName) {
              alreadyExist = true
            }
          })
          this.$set(v, 'exist', alreadyExist)
          v.originalValues = v
          return v
        })

        this.roleListLoading = false
      }).catch(() => {
        this.roleListLoading = false
      })
    },
    sortRoleChange(data) {
      const { prop, order } = data
      this.roleListQuery.orderBy = []
      if (order === 'ascending') {
        this.roleListQuery.orderBy.push(prop)
      } else if (order === 'descending') {
        this.roleListQuery.orderBy.push(prop + ' desc')
      }
      this.getRoleList()
    },
    addApiRoles() {
      if (this.selectedRoles.length < 1) {
        return
      }
      const requestParams = {
        roleApis: []
      }
      this.selectedRoles.forEach(item => {
        const apiRole = {
          apiId: this.apiId,
          roleId: item.roleId
        }
        requestParams.roleApis.push(apiRole)
      })
      addRoleApis(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataAddSuccess'),
          type: 'success'
        })
        this.getApiRoleList()
        this.dialogRoleVisible = false
      }).catch(() => {
        this.getRoleList()
      })
    },
    addApiRole(roleId) {
      const requestParams = {
        roleApis: []
      }
      const apiRole = {
        apiId: this.apiId,
        roleId: roleId
      }
      requestParams.roleApis.push(apiRole)
      addRoleApis(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataAddSuccess'),
          type: 'success'
        })
        this.getApiRoleList()
        this.dialogRoleVisible = false
      }).catch(() => {
        this.getRoleList()
      })
    }
  }
}
</script>

<style scoped>

</style>
