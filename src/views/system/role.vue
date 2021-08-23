<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.rolePhysicalName" :placeholder="$t('system.role.rolePhysicalName')" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('common.button.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        {{ $t('common.button.add') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteRoles">
        {{ $t('common.button.delete') }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" stripe :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @sort-change="sortChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" :label="$t('system.role.roleId')" width="100" prop="roleId" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.roleId }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" :label="$t('system.role.rolePhysicalName')" prop="rolePhysicalName" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.rolePhysicalName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" :label="$t('system.role.roleLogicalName')">
        <template slot-scope="{row}">
          <span>{{ row.roleLogicalName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="50px" :label="$t('system.role.user')">
        <template slot-scope="{row}">
          <el-button
            type="info"
            round
            size="small"
            icon="el-icon-set-up"
            @click="showRoleUser(row)"
          >
            {{ $t('system.role.user') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="50px" :label="$t('system.role.api')">
        <template slot-scope="{row}">
          <el-button
            type="info"
            round
            size="small"
            icon="el-icon-set-up"
            @click="showRoleApi(row)"
          >
            {{ $t('system.role.api') }}
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
            @click="handleEdit(row.roleId)"
          >
            {{ $t('common.button.edit') }}
          </el-button>
          <el-popconfirm
            :title="$t('confirm.messageDelete')"
            :confirm-button-text="$t('confirm.btnOk')"
            :cancel-button-text="$t('confirm.btnCancel')"
            @onConfirm="deleteRole(row.roleId)"
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
    <el-dialog :title="temp.roleId?$t('system.role.formTitleEdit')+temp.roleId:$t('system.role.formTitleAdd')" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="roleForm" :rules="rules" :model="temp" label-position="right" label-width="150px">
        <el-form-item :label="$t('system.role.formRolePhysicalName')" prop="rolePhysicalName">
          <el-input v-model="temp.rolePhysicalName" />
        </el-form-item>
        <el-form-item :label="$t('system.role.formRoleLogicalName')" prop="roleLogicalName">
          <el-input v-model="temp.roleLogicalName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.button.cancel') }}
        </el-button>
        <el-button type="primary" @click="saveRole">
          {{ $t('common.button.submit') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('system.role.roleUser')" :visible.sync="dialogRoleUserVisible" width="70%">
      <role-user :role-id="selectDetailRoleId" />
    </el-dialog>
    <el-dialog :title="$t('system.role.roleApi')" :visible.sync="dialogRoleApiVisible" width="70%">
      <role-api :role-id="selectDetailRoleId" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, editRole, addRole, deleteRoles } from '@/api/system/system-role'
import Pagination from '@/components/Pagination'
import { RoleUser, RoleApi } from './components'
import { stringValidator } from '@/validator/validator'

export default {
  name: 'Role',
  components: { Pagination, RoleUser, RoleApi },
  data() {
    return {
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        rolePhysicalName: '',
        pageNumber: 1,
        pageSize: 10,
        orderBy: []
      },
      temp: {
        rolePhysicalName: '',
        roleLogicalName: ''
      },
      dialogFormVisible: false,
      rules: {
        rolePhysicalName: [{ required: true, trigger: 'blur', trim: true, max: 50, validator: stringValidator, fullField: this.$t('system.role.formRolePhysicalName') }],
        roleLogicalName: [{ required: true, trigger: 'blur', trim: true, max: 50, validator: stringValidator, fullField: this.$t('system.role.formRoleLogicalName') }]
      },
      selectedRoles: [],
      dialogRoleUserVisible: false,
      dialogRoleApiVisible: false,
      selectDetailRoleId: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.selectedRoles = val
    },
    deleteRoles() {
      if (this.selectedRoles.length < 1) {
        return
      }
      this.$confirm(this.$t('confirm.messageDelete'), this.$t('confirm.title'), {
        confirmButtonText: this.$t('confirm.btnOk'),
        cancelButtonText: this.$t('confirm.btnCancel'),
        type: 'warning'
      }).then(() => {
        const requestParams = { roleIds: [] }
        this.selectedRoles.forEach(item => {
          requestParams.roleIds.push(item.roleId)
        })
        deleteRoles(requestParams).then(() => {
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
    deleteRole(roleId) {
      const requestParams = { roleIds: [] }
      requestParams.roleIds.push(roleId)
      deleteRoles(requestParams).then(() => {
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
        rolePhysicalName: '',
        roleLogicalName: ''
      }
      if (this.$refs['roleForm']) {
        this.$nextTick(() => {
          this.$refs['roleForm'].clearValidate()
        })
      }
    },
    handleEdit(roleId) {
      this.resetTemp()
      const retrieveParam = {
        roleId: roleId
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
    saveRole() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          if (this.temp.roleId) {
            editRole(this.temp).then(() => {
              this.$message({
                message: this.$t('message.dataEditSuccess'),
                type: 'success'
              })
              this.getList()
              this.dialogFormVisible = false
            }).catch(() => {

            })
          } else {
            addRole(this.temp).then(() => {
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
    showRoleUser(row) {
      this.selectDetailRoleId = row.roleId
      this.dialogRoleUserVisible = true
    },
    showRoleApi(row) {
      this.selectDetailRoleId = row.roleId
      this.dialogRoleApiVisible = true
    }
  }
}
</script>

<style scoped>

</style>
