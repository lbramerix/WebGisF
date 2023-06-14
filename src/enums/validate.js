// 登录规则
const validateName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("用户名不能为空"));
  } else {
    callback();
  }
};

export const validatePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("密码不能为空"));
  } else {
    callback();
  }
};

export const SignInRules = {
  username: [{ validator: validateName, trigger: "blur", min: 3 }],
  password: [{ validator: validatePassword, trigger: "blur", min: 3 }],
};

// 注册规则
export const SignUpRules = {
  id: [{ required: true, trigger: "blur", min: 3 }],
  password: [{ required: true, trigger: "blur", min: 3 }],
};

// 修改信息规则
export const ChangeInfoRules = {
  username: [{ required: true, trigger: "blur", min: 3 }
  ],
  id: [{ required: true, trigger: "blur", min: 3 }],
  sex: [{ required: true, trigger: "blur", min: 3 }],
  jianjie: [{ required: true, trigger: "blur", min: 3 }],
};

// 修改密码规则
export const ChangePwdRules = {
  oldPwd: [{ required: true, trigger: "blur", min: 3 }],
  newPwd: [{ required: true, trigger: "blur", min: 3 }],
  confirmPwd: [{ required: true, trigger: "blur", min: 3 }],
};
