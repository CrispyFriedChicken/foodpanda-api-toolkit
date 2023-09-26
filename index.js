class Index {
    constructor(account, password, publicToken = null) {
        this.account = account;
        this.password = password;
        this.publicToken = publicToken; // 初始 token 為 null
        this.axios = require('axios').default;
        this.host = 'https://tw.fd-api.com/api';
    }

    /**
     * login
     *
     * @returns {Promise<void>}
     */
    async login() {
        try {
            // 若既有的publicToken可以正常執行，則不登入
            if (this.publicToken) {
                let res = await this.getHistoryOrders();
                if (res) {
                    // console.log('publicToken 可用，不執行登入');
                    return;
                } else {
                    // console.log('publicToken 無效，執行登入');
                }
            } else {
                // console.log('執行登入!');
            }

            const response = await this.axios.post('https://www.foodpanda.com.tw/login/new/api/login', {
                username: this.account,
                password: this.password,
                platform: 'b2c',
            }, {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                    'x-device': 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleW1ha2VyLXZvbG8tZGV2aWNlLWZwLXR3IiwidHlwIjoiSldUIn0.eyJpZCI6IjA5YTkwYjZlLWVlZmUtNGE4NS04ODIyLWJlYjJjYmZhOGE2NCIsImNsaWVudF9pZCI6InZvbG8iLCJ1c2VyX2lkIjoidHd2enEzdWUiLCJleHBpcmVzIjo0ODQ1OTIzMDU1LCJ0b2tlbl90eXBlIjoiYmVhcmVyIiwic2NvcGUiOiJERVZJQ0VfVE9LRU4ifQ.Rj6LJ3L0UKtqceN-M6CETNm_akGiCIvi67H-RyiNSNDAcj5aEZB7f8Dg4igviDx4s7LZflRaqNPBazzddmKUYjUSZlJUhZA2M0dOLA7GEQG_PFKAJKGr8INFNsei8tw2Qam_0s73oAgya1ujeFYf_abdnxMkgQU8Ht9ttzYXf2xIbfQr72jpVIFLKbtFWL6hWff66RXRbTs4eyiPWgO6vxMt4cq0LJQjvVGRD0WNI0yNTBJnkRLwDUevO0GxRLv6N8E66H-WrC-shXeU96yauUSoebPkvHbE3LlyY74Wt2-gytlPDKta9ZIdUAgMeKOy3j-j0XLtwwtWL8fmP9W1EQ'
                }
            });
            // 獲取所有的 set-cookie headers
            let setCookieArray = response.headers['set-cookie'];
            // 找到開頭是 "token=" 的那個 cookie
            let tokenCookie = setCookieArray.find(cookie => cookie.startsWith('token='));
            // 使用正則表達式從 cookie 字串中提取 token
            let tokenMatch = tokenCookie.match(/token=([^;]+)/);
            this.publicToken = tokenMatch ? tokenMatch[1] : null;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
     * getHistoryOrders
     *
     * @returns {Promise<*>}
     */
    async getHistoryOrders(offset = 0, limit = 20) {
        return new Promise(async (resolve) => {
            try {
                const response =
                    await this.axios.get(`${this.host}/v5/orders/order_history?include=order_products,order_details&language_id=6&offset=${offset}&limit=${limit}`, {
                        headers: {
                            "authorization": `Bearer ${this.publicToken}`,
                            "x-fp-api-key": "volo",
                        }
                    });
                const data = response.data.data;
                resolve(data);
            } catch (err) {
                resolve(false);
            }
        });
    }

    /**
     * getActiveOrders
     *
     * @returns {Promise<*>}
     */
    async getActiveOrders() {
        return new Promise(async (resolve) => {
            try {
                const response =
                    await this.axios.get(`${this.host}/v5/tracking/active-orders`, {
                        headers: {
                            "authorization": `Bearer ${this.publicToken}`,
                            "x-fp-api-key": "volo",
                        }
                    });
                const data = response.data.data;
                resolve(data);
            } catch (err) {
                resolve(false);
            }
        });
    }

    /**
     * getOrderDetail
     *
     * @returns {Promise<*>}
     */
    async getOrderDetail(orderId) {
        return new Promise(async (resolve) => {
            try {
                const response =
                    await this.axios.get(`${this.host}/v5/wallet/transactionhistory/${orderId}`, {
                        headers: {
                            "authorization": `Bearer ${this.publicToken}`,
                            "x-fp-api-key": "volo",
                        }
                    });
                const data = response.data.data;
                resolve(data);
            } catch (err) {
                resolve(false);
            }
        });
    }

    /**
     * getOrderTracking
     *
     * @returns {Promise<*>}
     */
    async getOrderTracking(orderId) {
        return new Promise(async (resolve) => {
            try {
                const response =
                    await this.axios.get(`${this.host}/v5/tracking/orders/${orderId}?time_variation=Variation6&stacked_order_variation=Variation1&delivery_time_variation=Variation1&order_status_variation=Control`, {
                        headers: {
                            "authorization": `Bearer ${this.publicToken}`,
                            "x-fp-api-key": "volo",
                        }
                    });
                const data = response.data.data;
                resolve(data);
            } catch (err) {
                resolve(false);
            }
        });
    }

    /**
     * getCouponList
     *
     * @returns {Promise<unknown>}
     */
    async getCouponList() {
        return new Promise(async (resolve) => {
            try {
                const response =

                    await this.axios.get(`${this.host}/v6/incentives-wallet/vouchers?locale=zh_TW&platform=web_frontend&statuses=APPLICABLE%2CNOT_APPLICABLE`, {
                        headers: {
                            "authorization": `Bearer ${this.publicToken}`,
                            "x-fp-api-key": "volo",
                        }
                    });
                const data = response.data.data;
                resolve(data);
            } catch (err) {
                resolve(false);
            }
        });
    }

    /**
     * couponCode
     *
     * @param couponCode
     * @returns {Promise<unknown>}
     */
    async useCoupon(couponCode) {
        return new Promise(async (resolve) => {
            try {
                const url = 'https://tw.fd-api.com/api/v6/incentives-wallet/vouchers/save?locale=zh_TW';
                const headers = {
                    "authorization": `Bearer ${this.publicToken}`,
                    "x-fp-api-key": "volo",
                    "Content-Type": "application/json;charset=UTF-8",
                    "x-pd-language-id": 6,
                };
                const data = {
                    'code': couponCode
                };
                const response = await this.axios.post(url, data, {headers});
                resolve(response.data);
            } catch (err) {
                resolve(err.response.data);
            }
        });
    }
}

module.exports = Index;