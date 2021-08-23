<template>
  <div>
    <div class="filter-container">
      <el-input v-model="userRoleListQuery.rolePhysicalName" size="small" :placeholder="$t('system.role.rolePhysicalName')" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="getUserRoleList">
        {{ $t('common.button.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="small" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        {{ $t('common.button.add') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="small" type="danger" icon="el-icon-delete" @click="deleteUserRoles">
        {{ $t('common.button.delete') }}
      </el-button>
    </div>
    <el-table
      v-loading="userRoleListLoading"
      stripe
      :data="userRoleList"
      size="small"
      border
      fit
      highlight-current-row
      height="400"
      style="width: 100%"
      @selection-change="handleUserRoleSelectionChange"
      @sort-change="sortUserRoleChange"
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
            @onConfirm="deleteUserRole(row.roleUserId)"
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
    <pagination v-show="userRoleTotal>0" :total="userRoleTotal" :page.sync="userRoleListQuery.pageNumber" :limit.sync="userRoleListQuery.pageSize" @pagination="getUserRoleList" />
    <el-dialog :title="$t('system.user.userRoleAdd')" :visible.sync="dialogRoleVisible" width="60%" append-to-body>
      <div class="filter-container">
        <el-input v-model="roleListQuery.rolePhysicalName" size="small" :placeholder="$t('system.role.rolePhysicalName')" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" size="small" icon="el-icon-search" @click="getRoleList">
          {{ $t('common.button.search') }}
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" size="small" type="success" icon="el-icon-check" @click="addUserRoles">
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
                @click="addUserRole(row.roleId)"
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
import { fetchList as fetchUserRoleList, deleteRoleUsers, addRoleUsers } from '@/api/system/system-role-user'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserRole',
  components: { Pagination },
  props: {
    userId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      userRoleTotal: 0,
      userRoleList: null,
      userRoleListLoading: true,
      userRoleListQuery: {
        userId: 0,
        rolePhysicalName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      },
      selectedUserRoles: [],
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
    userId() {
      this.resetUserRoleListQuery()
      this.getUserRoleList()
    }
  },
  created() {
    this.getUserRoleList()
  },
  methods: {
    canSelect(row, index) {
      if (!row.exist) {
        return true
      }
      return false
    },
    resetUserRoleListQuery() {
      this.userRoleListQuery = {
        userId: 0,
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
    handleUserRoleSelectionChange(val) {
      this.selectedUserRoles = val
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
    getUserRoleList() {
      this.userRoleListLoading = true
      this.userRoleListQuery.userId = this.userId
      fetchUserRoleList(this.userRoleListQuery).then((response) => {
        const data = response.data
        this.userRoleTotal = data.total
        this.userRoleList = data.records
        this.userRoleListLoading = false
      }).catch(() => {
        this.userRoleListLoading = false
      })
    },
    deleteUserRoles() {
      if (this.selectedUserRoles.length < 1) {
        return
      }
      this.$confirm(this.$t('confirm.messageDelete'), this.$t('confirm.title'), {
        confirmButtonText: this.$t('confirm.btnOk'),
        cancelButtonText: this.$t('confirm.btnCancel'),
        type: 'warning'
      }).then(() => {
        const requestParams = {
          roleUserIds: []
        }
        this.selectedUserRoles.forEach(item => {
          requestParams.roleUserIds.push(item.roleUserId)
        })
        deleteRoleUsers(requestParams).then(() => {
          this.$message({
            message: this.$t('message.dataDeleteSuccess'),
            type: 'success'
          })
          this.getUserRoleList()
        }).catch(() => {
          this.getUserRoleList()
        })
      })
    },
    deleteUserRole(userRoleId) {
      const requestParams = {
        roleUserIds: []
      }
      requestParams.roleUserIds.push(userRoleId)
      deleteRoleUsers(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataDeleteSuccess'),
          type: 'success'
        })
        this.getUserRoleList()
      }).catch(() => {
        this.getUserRoleList()
      })
    },
    sortUserRoleChange(data) {
      const { prop, order } = data
      this.userRoleListQuery.orderBy = []
      if (order === 'ascending') {
        this.userRoleListQuery.orderBy.push(prop)
      } else if (order === 'descending') {
        this.userRoleListQuery.orderBy.push(prop + ' desc')
      }
      this.getUserRoleList()
    },
    getRoleList() {
      this.roleListLoading = true
      fetchList(this.roleListQuery).then((response) => {
        const data = response.data
        this.roleTotal = data.total

        const items = data.records
        this.roleList = items.map(v => {
          let alreadyExist = false
          this.userRoleList.some(r => {
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
    addUserRoles() {
      if (this.selectedRoles.length < 1) {
        return
      }
      const requestParams = {
        roleUsers: []
      }
      this.selectedRoles.forEach(item => {
        const userRole = {
          userId: this.userId,
          roleId: item.roleId
        }
        requestParams.roleUsers.push(userRole)
      })
      addRoleUsers(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataAddSuccess'),
          type: 'success'
        })
        this.getUserRoleList()
        this.dialogRoleVisible = false
      }).catch(() => {
        this.getRoleList()
      })
    },
    addUserRole(roleId) {
      const requestParams = {
        roleUsers: []
      }
      const userRole = {
        userId: this.userId,
        roleId: roleId
      }
      requestParams.roleUsers.push(userRole)
      addRoleUsers(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataAddSuccess'),
          type: 'success'
        })
        this.getUserRoleList()
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
