$(document).ready(function () {

    let serverUrl = 'https://quanly-hv.herokuapp.com/users'
    // let serverUrl = 'http://localhost:3000/'


    //modal
    $('.modal-add,.modal-edit,.modal-delete, .modal-complete').click(function () {
        $(this).addClass('hide')
    })

    $('.input-data,.edit-data,.delete-data,.complete-data').on('click', function (event) {
        event.stopPropagation();
    })

    // Tự TẮT thông báo chỉnh sửa thành công sau 3s
    let countDown;
    function complete() {
        $('.modal-complete').removeClass('hide');

        countDown = setTimeout(function () {
            $('.modal-complete').addClass('hide');
        }, 2000)
    }

    // Tắt Modal thêm/edit thông tin
    $('i.fa-times').click(function () {
        $('.modal-edit').addClass('hide');
        $('.modal-add').addClass('hide');
        $('.modal-complete').addClass('hide');
        clearTimeout(countDown);
    })

    // Lệnh mở form nhập vào Nút Thêm học viên
    $('.btn-add').click(function () {
        $('.modal-add').removeClass('hide');
    })

    // Phần lấy dữ liệu từ database -------------------------------------------------

    let id = [];
    let item_per_page = 3;

    function loadData() {
        $.ajax({
            url: serverUrl
        }).done(
            function (data) {

                let list = data.reverse();

                // console.log(list)

                let total_pages = Math.ceil(data.length / item_per_page);

                for (let i = 1; i <= total_pages; i++) {
                    $('.next').before(`<button class="page">${i}</button>`)
                }

                Pagination(list, item_per_page, total_pages)

            }

        ).fail(function () {
            alert('Truy xuất thông tin thất bại');
        })
    }

    loadData();


    //Pagination

    function Pagination(arr, item_per_page, total_pages) {

        let current_page = 1, start = 0, end = item_per_page;
        let pg = arr.slice(start, end);

        CreateTable(pg);

        $('.page').eq(0).css('background-color', '#8b8b8b')

        if (start <= 0) {
            $('.prev').attr('disabled', true);
        }

        $('.page').click((e) => {
            $('.prev').attr('disabled', false);

            current_page = $(e.target).index();

            start = item_per_page * (current_page - 1)
            end = start + item_per_page;

            if (end > arr.length) {
                end = arr.length;
            }

            pg = arr.slice(start, end);

            CreateTable(pg);

            $('.page').eq(current_page - 1).css('background', '#8b8b8b');
            $('.page').eq(current_page - 1).siblings().css('background', 'white');
        })

        $('.prev').click(() => {

            $('.next').attr('disabled', false);

            current_page -= 1;

            if (current_page > 1) {
                start = item_per_page * (current_page - 1);
                end = start + item_per_page;
                pg = arr.slice(start, end);

                CreateTable(pg);

                $('.page').eq(current_page - 1).css('background', '#8b8b8b');
                $('.page').eq(current_page - 1).siblings().css('background', 'white');

            } else {
                $('.prev').attr('disabled', true);

                $('.page').eq(0).css('background', '#8b8b8b');
                $('.page').eq(0).siblings().css('background', 'white');
                
                pg = arr.slice(0, item_per_page);
                CreateTable(pg);
            }
            console.log(current_page)

        })

        $('.next').click(() => {

            $('.prev').attr('disabled', false);

            current_page += 1;

            if (current_page < total_pages) {
                start = item_per_page * (current_page - 1);
                end = start + item_per_page;
                pg = arr.slice(start, end);

                CreateTable(pg);

                $('.page').eq(current_page - 1).css('background', '#8b8b8b');
                $('.page').eq(current_page - 1).siblings().css('background', 'white');

            } else {
                $('.next').attr('disabled', true);

                $('.page').last().css('background', '#8b8b8b');
                $('.page').last().siblings().css('background', 'white');
                start = item_per_page * (total_pages - 1);
                end = arr.length;
                pg = arr.slice(start, end);
                CreateTable(pg);
            }

            console.log(current_page)

        })


    }

    function CreateTable(array) {

        $('table > tbody').empty()

        $.each(array, function (index) {

            $('table > tbody').append(
                `<tr>
                <td class="avatar"><img src="${array[index].avatar}" alt="student-image" width="100px"></td>
                <td class="name">${array[index].name}</td>
                <td class="dob">${array[index].dob}</td>
                <td class="gender">${array[index].gender}</td>
                <td class="address">${array[index].address}</td>
                <td class="email">${array[index].email}</td>
                <td class="phone">${array[index].phone}</td>
                <td><i class="far fa-edit"></i>&nbsp;&nbsp;&nbsp;<i class="far fa-trash-alt"></i></td>
                </tr>`
            )

        })

        id = [];
        $.each(array, function (index) {
            id.push(array[index].id)
        })

        $('i.fa-edit').on('click', function () {
            $('.modal-edit').removeClass('hide');

            let item = $(this).parent().parent();
            index = item.index();

            // Lấy avatar
            let current_avatar = item.find('img').attr('src');
            $('.edit-data img').attr('src', current_avatar);

            // Lấy thông tin tên
            let current_name = item.find('.name').text();
            $('.edit-data #name').val(current_name);

            // Lấy thông tin ngày sinh
            let current_dob = item.find('.dob').text();
            $('.edit-data #dob').val(current_dob);

            // Lấy thông tin giới tính
            let gender = item.find('.gender').text();
            if (gender == "Nam") {
                $('.edit-data #male').attr('checked', 'checked');
            } else if (gender == "Nữ") {
                $('.edit-data #female').attr('checked', 'checked');
            } else {
                $('.edit-data #other').attr('checked', 'checked');
            }

            // Lấy thông tin địa chỉ
            let current_address = item.find('.address').text();
            $('.edit-data #DiaChi').val(current_address);

            // Lấy thông tin e-mail
            let current_email = item.find('.email').text();
            $('.edit-data #email').val(current_email);

            // Lấy thông tin sdt
            let current_phone = item.find('.phone').text();
            $('.edit-data #sdt').val(current_phone);
        });
    }

    // Hàm lấy dữ liệu từ form nhập thông tin mới
    function NhapData() {

        $('.modal-add').addClass('hide');

        let new_avatar = $(".input-data #avatar").val();
        let new_name = $('.input-data #name').val();
        let new_dob = $('.input-data #dob').val();
        let new_gender = $('.input-data input[name="gender"]:checked').val();
        let new_address = $('.input-data #address').val();
        let new_email = $('.input-data #email').val();
        let new_phone = $('.input-data #sdt').val();

        $('table > tbody').prepend(`<tr><td class="avatar"><img src="${new_avatar}" alt="student-image" width="100px"></td><td class="name">${new_name}</td><td class="dob">${new_dob}</td><td class="gender">${new_gender}</td>
            <td class="address"> ${new_address}</td><td class="email">${new_email}</td><td class="phone">${new_phone}</td><td><i class="far fa-edit"></i>&nbsp;&nbsp;&nbsp;<i class="far fa-trash-alt"></i></td></tr>`
        )
    }

    // Lệnh tạo thông tin học viên mới ---------------------------------------------
    $('.submit').on('click', function () {

        $.ajax({
            url: serverUrl,
            data: {
                avatar: $('.input-data #Avatar').val(),
                name: $('.input-data #Name').val(),
                dob: $('.input-data #Dob').val(),
                gender: $('.input-data input[name="gender"]:checked').val(),
                email: $('.input-data #Email').val(),
                address: $('.input-data #Address').val(),
                phone: $('.input-data #sDt').val()
            },
            method: 'post',


        }).done(function () {
            NhapData();
            complete();
            document.addForm.reset();
            setTimeout(function () { window.location.reload(); }, 2000)
        })
    })

    // lấy index của dòng dc chọn
    let index;
    $('table').on('click', 'tr', function () {
        index = $(this).index();
    })

    // Hiện modal xác nhận xoá
    $('table').on('click', '.fa-trash-alt', function () {
        $('.modal-delete').removeClass('hide');
    })

    //Xoá học viên sau khi xác nhận bằng hành động ấn vào nút Xoá ------------------
    $('.confirm').on('click', function () {

        $.ajax({
            url: serverUrl + "/" + id[index],
            type: 'delete'
        }).done(function () {
            // Tắt Modal xoá item
            $('.modal-delete').addClass('hide');
            complete();
            setTimeout(function () {
                window.location.reload()
            }, 2000);
        }).fail(function () {
            alert('Xoá thông tin người dùng thất bại')
        })

    })

    // Huỷ lệnh xoá sau khi dùng chức năng edit hoặc ấn icon thùng rác
    $('.cancel').click(function () {
        $('.modal-delete').addClass('hide');
    })

    //Mở modal xác nhận xoá item trong quá trình chỉnh sửa
    $('.delete').click(function () {
        $('.modal-edit').addClass('hide');
        $('.modal-delete').removeClass('hide');
    })

    //Khai báo hàm truyền dữ liệu-------------------------------------------------
    function UpdateData() {
        $.ajax({
            url: serverUrl + "/" + id[index],
            method: 'PUT',
            data: {
                avatar: $('.edit-data img').attr('src'),
                name: $('.edit-data input#name').val(),
                dob: $('.edit-data #dob').val(),
                gender: $('.edit-data input[name="gender"]:checked').val(),
                email: $('.edit-data #email').val(),
                address: $('.edit-data #DiaChi').val(),
                phone: $('.edit-data #sdt').val()
            },

        }).done(function () {

            $('.modal-edit').addClass('hide');

            complete();

            setTimeout(function () {
                window.location.reload()
            }, 2000);

        }).fail(function () {
            alert('Cập nhật thất bại')
        })
    }

    // Lệnh Sửa thông tin học viên 
    $('.update').on('click', function () {
        console.log(index);
        $('.modal-edit').addClass('hide');

        UpdateData();

    })


    // Search
    function search() {
        $('.searchItem').click(function (event) {

            event.preventDefault();

            $('.next').attr('disabled', false);

            let keyword = $('#keyword').val();

            $.ajax({
                url: serverUrl + '?q=' + keyword
            }).done(
                function (data) {

                    if (data.length == 0) {
                        alert('Không có kết quả phù hợp!');

                    }

                    $('table > tbody').empty();
                    $('.page').remove();

                    let total_pages = Math.ceil(data.length / item_per_page);

                    for (let i = 1; i <= total_pages; i++) {
                        $('.next').before(`<button class="page">${i}</button>`)
                    }

                    Pagination(data, item_per_page, total_pages);
                }

            )
        })
    }

    search();

    // Sắp xếp

    function arrangeByName() {

        $('.next').attr('disabled', false);

        $.ajax({
            url: serverUrl
        }).done(
            function (data) {
                current_page = 1;
                $('.page').remove();

                let total_pages = Math.ceil(data.length / item_per_page);

                for (let i = 1; i <= total_pages; i++) {
                    $('.next').before(`<button class="page">${i}</button>`)
                }

                Pagination(data, item_per_page, total_pages)

            }

        ).fail(function () {
            alert('Truy xuất thông tin thất bại');
        })
    }

    $('.name-up').click(function () {
        serverUrl = 'https://quanly-hv.herokuapp.com/users?_sort=name&_order=asc'
        arrangeByName()
    })

    $('.name-down').click(function () {
        serverUrl = 'https://quanly-hv.herokuapp.com/users?_sort=name&_order=desc'
        arrangeByName()
    })

    function arrangeByDob() {

        $('.next').attr('disabled', false);

        $.ajax({
            url: serverUrl
        }).done(
            function (data) {
                
                $('.page').remove();

                let total_pages = Math.ceil(data.length / item_per_page);

                for (let i = 1; i <= total_pages; i++) {
                    $('.next').before(`<button class="page">${i}</button>`)
                }

                Pagination(data, item_per_page, total_pages)

            }

        ).fail(function () {
            alert('Truy xuất thông tin thất bại');
        })
    }

    $('.date-up').click(function () {
        serverUrl = 'https://quanly-hv.herokuapp.com/users?_sort=dob&_order=asc'
        arrangeByDob()
    })

    $('.date-down').click(function () {
        serverUrl = 'https://quanly-hv.herokuapp.com/users?_sort=dob&_order=desc'
        arrangeByDob()
    })

})
