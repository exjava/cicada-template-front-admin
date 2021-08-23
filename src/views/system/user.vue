<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" :placeholder="$t('system.user.userName')" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('common.button.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        {{ $t('common.button.add') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteUsers">
        {{ $t('common.button.delete') }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" stripe :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @sort-change="sortChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" :label="$t('system.user.userId')" width="80" prop="userId" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" :label="$t('system.user.userName')" prop="userName" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" :label="$t('system.user.email')">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="60px" :label="$t('system.user.firstName')">
        <template slot-scope="{row}">
          <span>{{ row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="60px" :label="$t('system.user.lastName')">
        <template slot-scope="{row}">
          <span>{{ row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="40px" :label="$t('system.user.accountExpired')">
        <template slot-scope="{row}">
          <span>
            <font v-if="row.accountExpired=='1'" color="red">Expired</font>
            <font v-else>Normal</font>
          </span>
        </template>
      </el-table-column>

      <el-table-column min-width="40px" :label="$t('system.user.accountLock')">
        <template slot-scope="{row}">
          <span>
            <font v-if="row.accountLock=='1'" color="red">Locked</font>
            <font v-else>Normal</font>
          </span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" :label="$t('system.user.registrationDatetime')">
        <template slot-scope="{row}">
          <span>{{ row.registrationDatetime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="50px" :label="$t('system.user.role')">
        <template slot-scope="{row}">
          <el-button
            type="info"
            round
            size="small"
            icon="el-icon-set-up"
            @click="showUserRole(row)"
          >
            {{ $t('system.user.role') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.label.action')" width="200">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            round
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(row.userId)"
          >
            {{ $t('common.button.edit') }}
          </el-button>
          <el-popconfirm
            :title="$t('confirm.messageDelete')"
            :confirm-button-text="$t('confirm.btnOk')"
            :cancel-button-text="$t('confirm.btnCancel')"
            @onConfirm="deleteUser(row.userId)"
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
    <el-dialog :title="temp.userId?$t('system.user.formTitleEdit')+temp.userId:$t('system.user.formTitleAdd')" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="userForm" :rules="rules" :model="temp" label-position="right" label-width="100px">
        <el-form-item :label="$t('system.user.userName')" prop="userName">
          <el-input v-model="temp.userName" />
        </el-form-item>
        <el-form-item :label="$t('system.user.password')" prop="loginPassword">
          <el-input v-model="temp.loginPassword" type="password" />
        </el-form-item>
        <el-form-item :label="$t('system.user.email')" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item :label="$t('system.user.firstName')" prop="firstName">
          <el-input v-model="temp.firstName" />
        </el-form-item>
        <el-form-item :label="$t('system.user.lastName')" prop="lastName">
          <el-input v-model="temp.lastName" />
        </el-form-item>
        <el-form-item :label="$t('system.user.accountLock')" prop="accountLock">
          <el-select v-model="temp.accountLock" size="small">
            <el-option
              v-for="item in accountLockOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.user.accountExpired')" prop="accaccountExpiredountLock">
          <el-select v-model="temp.accountExpired" size="small">
            <el-option
              v-for="item in accountExpiredOptions"
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
        <el-button type="primary" @click="saveUser">
          {{ $t('common.button.submit') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('system.user.userRole')" :visible.sync="dialogUserRoleVisible" width="70%">
      <user-role :user-id="roleUserId" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, editUser, addUser, deleteUsers } from '@/api/system/system-user'
import Pagination from '@/components/Pagination'
import { stringValidator } from '@/validator/validator'
import { UserRole } from './components'
export default {
  name: 'User',
  components: { Pagination, UserRole },
  data() {
    return {
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        userName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      },
      temp: {
        userName: '',
        loginPassword: ''
      },
      dialogFormVisible: false,
      dialogUserRoleVisible: false,
      rules: {
        userName: [{ required: true, trigger: 'blur', trim: true, max: 50, validator: stringValidator, fullField: this.$t('system.user.userName') }]
      },
      selectedUsers: [],
      roleUserId: '',
      accountExpiredOptions: [{
        value: '0',
        label: 'Normal'
      }, {
        value: '1',
        label: 'Expired'
      }],
      accountLockOptions: [{
        value: '0',
        label: 'Normal'
      }, {
        value: '1',
        label: 'Locked'
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.selectedUsers = val
    },
    deleteUsers() {
      if (this.selectedUsers.length < 1) {
        return
      }
      this.$confirm(this.$t('confirm.messageDelete'), this.$t('confirm.title'), {
        confirmButtonText: this.$t('confirm.btnOk'),
        cancelButtonText: this.$t('confirm.btnCancel'),
        type: 'warning'
      }).then(() => {
        const requestParams = { userIds: [] }
        this.selectedUsers.forEach(item => {
          requestParams.userIds.push(item.userId)
        })
        deleteUsers(requestParams).then(() => {
          this.$message({
            message: this.$t('message.dataDeleteSuccess'),
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {
        this.getList()
      })
    },
    deleteUser(userId) {
      const requestParams = { userIds: [] }
      requestParams.userIds.push(userId)
      deleteUsers(requestParams).then(() => {
        this.$message({
          message: this.$t('message.dataDeleteSuccess'),
          type: 'success'
        })
        this.getList()
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
        userName: '',
        loginPassword: ''
      }
      if (this.$refs['userForm']) {
        this.$nextTick(() => {
          this.$refs['userForm'].clearValidate()
        })
      }
    },
    saveUser() {
      this.rules.loginPassword = []
      if (!this.temp.userId) {
        this.rules.loginPassword = [{ required: true, trigger: 'blur', trim: true, max: 50, validator: stringValidator, fullField: this.$t('system.user.password') }]
      }
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.temp.userId) {
            editUser(this.temp).then(() => {
              this.$message({
                message: this.$t('message.dataEditSuccess'),
                type: 'success'
              })
              this.getList()
              this.dialogFormVisible = false
            }).catch(() => {

            })
          } else {
            addUser(this.temp).then(() => {
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
    handleEdit(userId) {
      this.resetTemp()
      const retrieveParam = {
        userId: userId
      }
      fetchList(retrieveParam).then((response) => {
        const data = response.data.records
        if (data.length && data.length > 0) {
          this.temp = data[0]
          this.temp.loginPassword = ''
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
    showUserRole(row) {
      this.roleUserId = row.userId
      this.dialogUserRoleVisible = true
    }
  }
}
</script>

<style scoped>

</style>
