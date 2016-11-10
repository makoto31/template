package admin

import "github.com/gorilla/mux"

// Init ... GAEハンドラー登録
func Init(r *mux.Router) *mux.Router {

	// 管理者用(login: adminで制限かけてるのでCSRF不要)

	return r
}
