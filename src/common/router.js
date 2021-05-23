class Router {
  constructor() {
    this.callBack = () => {
    }
  }

  beforeEach(callBack) {
    if (callBack instanceof Function) this.callBack = callBack
  }

  navigateTo(to) {
    this.callBack('navigateTo', to)
  }

  redirectTo(to) {
    this.callBack('redirectTo', to)
  }

  reLaunch(to) {
    this.callBack('reLaunch', to)
  }

  switchTab(to) {
    this.callBack('switchTab', to)
  }

  back(delta) {
    // #ifdef H5
    history.back()
    // #endif
    // #ifndef H5
    uni.navigateBack({
      delta
    })
    // #endif
  }
}

export default new Router()
