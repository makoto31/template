package controller

import (
	"net/http"

	"github.com/gorilla/csrf"
	"github.com/gorilla/mux"

	"gae/controller/admin"
	"gae/def"
)

// Init ... GAEハンドラー登録
func Init() {

	// コンテンツ用
	r := mux.NewRouter()
	r.HandleFunc("/", ok).Methods("GET")
	r.HandleFunc("/start", ok).Methods("GET")
	r.HandleFunc("/_ah/stop", ok).Methods("GET")

	// 管理者用(login: adminで制限かけてるのでCSRF不要)
	r = admin.Init(r)

	// API(CSRF対策エリア)
	api := mux.NewRouter()
	CSRF := csrf.Protect([]byte(def.CsrfKey))
	if def.Dev() {
		CSRF = csrf.Protect([]byte(def.CsrfKey), csrf.Secure(false))
	}
	r.PathPrefix("/api").Handler(CSRF(api))

	http.Handle("/", r)
}

func ok(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "OK.", 200)
}
