import { Component, Vue } from 'vue-property-decorator'
import axios from '@/axios-auth'

@Component({})
export default class BcolMixin extends Vue {
  async getErrorObj (errCode): Promise<any> {
    try {
      const fetchUrl = this.payApi + 'codes/errors/' + errCode
      // Currently no desirable way to handle errors during this request,
      // null is returned in any error situation regardless.
      const errObj = await axios.get(fetchUrl).catch()
      if (errObj?.data) {
        return errObj.data
      }
    } catch (e) {
      // ignore error
    }
    return null
  }

  getErrorCode (error): string {
    if (error?.response?.data?.errors) {
      const msgCode = error.response.data.errors.find(
        error => error.payment_error_type && error.payment_error_type.startsWith('BCOL')
      )
      if (msgCode) {
        return msgCode
      }
    }
    return null
  }

  get payApi (): string {
    return sessionStorage.getItem('PAY_API_URL')
  }
}
