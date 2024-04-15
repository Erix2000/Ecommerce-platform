<div className={`container ${styles['content']}`}>
            <div className={`${styles['product-main-content']} row`}>
                <div className="product-pics col-5">
                <div className="product-main-pic">
                    <img src="/image/01.jpg" alt="" />
                </div>
                <div className="product-sub-pics">
                    <div className="product-sub-pic">
                    <label htmlFor="img1">
                        <input type="radio" id="img1" name="img" />
                        <img src="/image/01.jpg" alt="" />
                    </label>
                    </div>
                    <div className="product-sub-pic">
                    <label htmlFor="img2">
                        <input type="radio" id="img2" name="img" />
                        <img src="/image/01.jpg" alt="" />
                    </label>
                    </div>
                    <div className="product-sub-pic">
                    <label htmlFor="img3">
                        <input type="radio" id="img3" name="img" />
                        <img src="/image/01.jpg" alt="" />
                    </label>
                    </div>
                    <div className="product-sub-pic">
                    <label htmlFor="img4">
                        <input type="radio" id="img4" name="img" />
                        <img src="/image/01.jpg" alt="" />
                    </label>
                    </div>
                </div>
                </div>
                <div className="product-main-right col-md-7 col-12">
                <div className="product-title">星巴克家常咖啡豆</div>
                <div className="product-p">
                    以最上乘的拉丁美洲咖啡豆綜合而成，帶來核果及可可般的味覺體驗，最特別的是在餘味中不斷呈現出烘烤後的自然甜味。
                </div>
                <div className="price-like">
                    <div className="product-price">$320</div>
                    <a className="product-like" type="button" href="">
                    <img src="/image/icon/stroke.svg" alt="" />
                    </a>
                </div>
                <div className="product-btn-group">
                    <div className="product-qua-btn">
                    <div className="qua">1</div>
                    <a className="minus qua-btn" href="">
                        <i className="bi bi-dash-lg" />
                    </a>
                    <a className="plus qua-btn" href="">
                        <i className="bi bi-plus-lg" />
                    </a>
                    </div>
                    <a className="add-cart" href="">
                    加入購物車
                    </a>
                </div>
                <div className="product-p-m">
                    簡介:
                    <br />
                    以最上乘的拉丁美洲咖啡豆綜合而成，帶來核果及可可般的味覺體驗，最特別的是在餘味中不斷呈現出烘烤後的自然甜味。
                </div>
                </div>
            </div>
            <div className="product-sub-content">
                <div className="panel-group">
                <input
                    type="radio"
                    name="panel-radio"
                    id="radio1"
                    className="panel-control"
                    defaultChecked=""
                />
                <input
                    type="radio"
                    name="panel-radio"
                    id="radio2"
                    className="panel-control"
                />
                <input
                    type="radio"
                    name="panel-radio"
                    id="radio3"
                    className="panel-control"
                />
                <div className="tab-group">
                    <label htmlFor="radio1" className="active">
                    商品內容
                    </label>
                    <label htmlFor="radio2">其他</label>
                    <label htmlFor="radio3">tab3</label>
                </div>
                <div className="content-group">
                    <div className="content content1">
                    以最上乘的拉丁美洲咖啡豆綜合而成，帶來核果及可可般的味覺體驗，最特別的是在餘味中不斷呈現出烘烤後的自然甜味。
                    </div>
                    <div className="content content2">content2</div>
                    <div className="content content3">content3</div>
                </div>
                </div>
                {/* <div class="tabs">
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">產品規格</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">商品內容</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">其他</a>
                        </li>
                    </ul>
                </div>
                
                <div class="tab-content">
                    以最上乘的拉丁美洲咖啡豆綜合而成，帶來核果及可可般的味覺體驗，最特別的是在餘味中不斷呈現出烘烤後的自然甜味。
                </div> */}
            </div>
            <div className="product-comments">
                <div className="product-comments-title">
                評論
                <span className="score">5</span>
                <i className="bi bi-star-fill star" />
                </div>
                <div className="product-comment row">
                <div className="product-comment-header col-2">
                    <img src="/image/dheader.jpg" alt="" />
                </div>
                <div className="prodoct-comment-content col-10">
                    <div className="prodoct-comment-content-top">
                    <div className="client-name">
                        jason@gmail.com
                        <div className="like">
                        <i className="bi bi-star-fill star" />
                        <i className="bi bi-star-fill star" />
                        <i className="bi bi-star-fill star" />
                        <i className="bi bi-star-fill star" />
                        <i className="bi bi-star-fill star" />
                        </div>
                    </div>
                    <div className="date">2024/01/25</div>
                    </div>
                    <div className="date-m">2024/01/25</div>
                    <div className="comment">
                    快速送達！包裝精美，價格便宜！冷冷的冬天很適合在家中來一杯，非常推薦～！
                    </div>
                </div>
                </div>
                <div className="product-comment row">
                <div className="product-comment-header col-2">
                    <img src="/image/dheader.jpg" alt="" />
                </div>
                <div className="prodoct-comment-content col-10">
                    <div className="prodoct-comment-content-top">
                    <div className="client-name">
                        jason@gmail.com
                        <div className="like">
                        <i className="bi bi-star-fill star" />
                        <i className="bi bi-star-fill star" />
                        <i className="bi bi-star-fill star" />
                        <i className="bi bi-star-fill star" />
                        <i className="bi bi-star-fill star" />
                        </div>
                    </div>
                    <div className="date">2024/01/25</div>
                    </div>
                    <div className="date-m">2024/01/25</div>
                    <div className="comment">
                    快速送達！包裝精美，價格便宜！冷冷的冬天很適合在家中來一杯，非常推薦～！
                    </div>
                </div>
                </div>
                <div className="more">
                <a href="">
                    more
                    <i className="bi bi-chevron-double-down" />
                </a>
                </div>
            </div>
        </div>


