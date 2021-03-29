import Mock from 'mockjs'

Mock.mock(/\/api\/internal\/user\/login*/, 'post', require('./json/userLogin.json'))