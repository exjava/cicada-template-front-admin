<template>
  <div>
    <div class="filter-container">
      <el-input v-model="roleUserListQuery.userName" size="small" :placeholder="$t('system.user.userName')" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="getRoleUserList">
        {{ $t('common.button.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="small" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        {{ $t('common.button.add') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="small" type="danger" icon="el-icon-delete" @click="deleteRoleUsers">
        {{ $t('common.button.delete') }}
      </el-button>
    </div>
    <el-table
      v-loading="roleUserListLoading"
      stripe
      :data="roleUserList"
      size="small"
      border
      fit
      highlight-current-row
      height="400"
      style="width: 100%"
      @selection-change="handleRoleUserSelectionChange"
      @sort-change="sortRoleUserChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" :label="$t('system.user.userId')" width="100" prop="userId" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.user.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('system.user.userName')" prop="userName" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.user.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" :label="$t('system.user.email')">
        <template slot-scope="{row}">
          <span>{{ row.user.email }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="50px" :label="$t('system.user.firstName')">
        <template slot-scope="{row}">
          <span>{{ row.user.firstName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="50px" :label="$t('system.user.lastName')">
        <template slot-scope="{row}">
          <span>{{ row.user.lastName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="40px" :label="$t('system.user.accountExpired')">
        <template slot-scope="{row}">
          <span v-if="row.user.accountExpired=='0'">Normal</span>
          <span v-else><font color="red">Expired</font></span>
        </template>
      </el-table-column>

      <el-table-column min-width="40px" :label="$t('system.user.accountLock')">
        <template slot-scope="{row}">
          <span v-if="row.user.accountLock=='0'">Normal</span>
          <span v-else><font color="red">Locked</font></span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.label.action')" width="110">
        <template slot-scope="{row}">
          <el-popconfirm
            :title="$t('confirm.messageDelete')"
            :confirm-button-text="$t('confirm.btnOk')"
            :cancel-button-text="$t('confirm.btnCancel')"
            @onConfirm="deleteRoleUser(row.roleUserId)"
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
    <pagination v-show="roleUserTotal>0" :total="roleUserTotal" :page.sync="roleUserListQuery.pageNumber" :limit.sync="roleUserListQuery.pageSize" @pagination="getRoleUserList" />
    <el-dialog :title="$t('system.role.roleUserAdd')" :visible.sync="dialogUserVisible" width="60%" append-to-body>
      <div class="filter-container">
        <el-input v-model="userListQuery.userName" size="small" :placeholder="$t('system.user.userName')" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" size="small" icon="el-icon-search" @click="getUserList">
          {{ $t('common.button.search') }}
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" size="small" type="success" icon="el-icon-check" @click="addRoleUsers">
          {{ $t('common.button.submit') }}
        </el-button>
      </div>
      <el-table
        v-loading="userListLoading"
        stripe
        :data="userList"
        size="small"
        border
        fit
        highlight-current-row
        height="350"
        style="width: 100%"
        @selection-change="handleUserSelectionChange"
        @sort-change="sortUserChange"
      >
        <el-table-column align="center" type="selection" width="50" :selectable="canSelect" />
        <el-table-column align="center" :label="$t('system.user.userId')" width="100" prop="userId" sortable="custom">
          <template slot-scope="{row}">
            <span>{{ row.userId }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="50px" :label="$t('system.user.userName')" prop="userName" sortable="custom">
          <template slot-scope="{row}">
            <span>{{ row.userName }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="100px" :label="$t('system.user.email')">
          <template slot-scope="{row}">
            <span>{{ row.email }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="50px" :label="$t('system.user.firstName')">
          <template slot-scope="{row}">
            <span>{{ row.firstName }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="50px" :label="$t('system.user.lastName')">
          <template slot-scope="{row}">
            <span>{{ row.lastName }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="40px" :label="$t('system.user.accountExpired')">
          <template slot-scope="{row}">
            <span v-if="row.accountExpired=='0'">Normal</span>
            <span v-else><font color="red">Expired</font></span>
          </template>
        </el-table-column>

        <el-table-column min-width="40px" :label="$t('system.user.accountLock')">
          <template slot-scope="{row}">
            <span v-if="row.accountLock=='0'">Normal</span>
            <span v-else><font color="red">Locked</font></span>
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
                @click="addRoleUser(row.userId)"
              >
                {{ $t('common.button.add') }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="userTotal>0" :total="userTotal" :page.sync="userListQuery.pageNumber" :limit.sync="userListQuery.pageSize" @pagination="getUserList" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/system/system-user'
import { fetchList as fetchUserRoleList, deleteRoleUsers, addRoleUsers } from '@/api/system/system-role-user'
import Pagination from '@/components/Pagination'

export default {
  name: 'RoleUser',
  components: { Pagination },
  props: {
    roleId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      roleUserTotal: 0,
      roleUserList: null,
      roleUserListLoading: true,
      roleUserListQuery: {
        roleId: 0,
        userName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      },
      selectedRoleUsers: [],
      userTotal: 0,
      userList: null,
      userListLoading: true,
      userListQuery: {
        userName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      },
      selectedUsers: [],
      dialogUserVisible: false
    }
  },
  watch: {
    roleId() {
      this.resetRoleUserListQuery()
      this.getRoleUserList()
    }
  },
  created() {
    this.getRoleUserList()
  },
  methods: {
    canSelect(row, index) {
      if (!row.exist) {
        return true
      }
      return false
    },
    resetRoleUserListQuery() {
      this.roleUserListQuery = {
        roleId: 0,
        userName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      }
    },
    resetUserListQuery() {
      this.userListQuery = {
        userName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      }
    },
    handleRoleUserSelectionChange(val) {
      this.selectedRoleUsers = val
    },
    handleUserSelectionChange(val) {
      this.selectedUsers = val
    },
    handleCreate() {
      this.selectedUsers = []
      this.resetUserListQuery()
      this.dialogUserVisible = true
      this.getUserList()
    },
    getRoleUserList() {
      this.roleUserListLoading = true
      this.roleUserListQuery.roleId = this.roleId
      fetchUserRoleList(this.roleUserListQuery).then((response) => {
        const data = response.data
        this.roleUserTotal = data.total
        this.roleUserList = data.records
        this.roleUserListLoading = false
      }).catch(() => {
        this.roleUserListLoading = false
      })
    },
    deleteRoleUsers() {
      if (this.selectedRoleUsers.length < 1) {
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
        this.selectedRoleUsers.forEach(item => {
          requestParams.roleUserIds.push(item.roleUserId)
        })
        deleteRoleUsers(requestParams).then(() => {
          this.$message({
            message: this.$t('message.dataDeleteSuccess'),
            type: 'success'
          })
          this.getRoleUserList()
        }).catch(() => {
          this.getRoleUserList()
        })
      })
    },
    deleteRoleUser(roleUserId) {
      const requestParams = {
        roleUserIds: []
      }
      requestParams.roleUserIds.push(roleUserId)
      deleteRoleUsers(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataDeleteSuccess'),
          type: 'success'
        })
        this.getRoleUserList()
      }).catch(() => {
        this.getRoleUserList()
      })
    },
    sortRoleUserChange(data) {
      const { prop, order } = data
      this.roleUserListQuery.orderBy = []
      if (order === 'ascending') {
        this.roleUserListQuery.orderBy.push(prop)
      } else if (order === 'descending') {
        this.roleUserListQuery.orderBy.push(prop + ' desc')
      }
      this.getRoleUserList()
    },
    getUserList() {
      this.userListLoading = true
      fetchList(this.userListQuery).then((response) => {
        const data = response.data
        this.userTotal = data.total

        const items = data.records
        this.userList = items.map(v => {
          let alreadyExist = false
          this.roleUserList.some(r => {
            if (r.user.userName === v.userName) {
              alreadyExist = true
            }
          })
          this.$set(v, 'exist', alreadyExist)
          v.originalValues = v
          return v
        })
        this.userListLoading = false
      }).catch(() => {
        this.userListLoading = false
      })
    },
    sortUserChange(data) {
      const { prop, order } = data
      this.userListQuery.orderBy = []
      if (order === 'ascending') {
        this.userListQuery.orderBy.push(prop)
      } else if (order === 'descending') {
        this.userListQuery.orderBy.push(prop + ' desc')
      }
      this.getUserList()
    },
    addRoleUsers() {
      if (this.selectedUsers.length < 1) {
        return
      }
      const requestParams = {
        roleUsers: []
      }
      this.selectedUsers.forEach(item => {
        const userRole = {
          roleId: this.roleId,
          userId: item.userId
        }
        requestParams.roleUsers.push(userRole)
      })
      addRoleUsers(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataAddSuccess'),
          type: 'success'
        })
        this.getRoleUserList()
        this.dialogUserVisible = false
      }).catch(() => {
        this.getUserList()
      })
    },
    addRoleUser(userId) {
      const requestParams = {
        roleUsers: []
      }
      const userRole = {
        userId: userId,
        roleId: this.roleId
      }
      requestParams.roleUsers.push(userRole)
      addRoleUsers(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataAddSuccess'),
          type: 'success'
        })
        this.getRoleUserList()
        this.dialogUserVisible = false
      }).catch(() => {
        this.getUserList()
      })
    }
  }
}
</script>

<style scoped>

</style>
