document.addEventListener("DOMContentLoaded", function() {
    const inputBookForm = document.getElementById("inputBook");
    const bookTitle = document.getElementById("inputBookTitle");
    const bookAuthor = document.getElementById("inputBookAuthor");
    const bookYear = document.getElementById("inputBookYear");
    const bookIsComplete = document.getElementById("inputBookIsComplete");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");

    const BOOKS_STORAGE_KEY = 'BOOKSHELF_APPS';
    const SEARCH_STORAGE_KEY = 'SEARCH_TERM';

    inputBookForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
    });

    function addBook() {
        const bookTitleValue = bookTitle.value;
        const bookAuthorValue = bookAuthor.value;
        const bookYearValue = parseInt(bookYear.value);
        const bookIsCompleteValue = bookIsComplete.checked;

        const book = {
            id: +new Date(),
            title: bookTitleValue,
            author: bookAuthorValue,
            year: bookYearValue,
            isComplete: bookIsCompleteValue
        };

        const books = getBooksFromStorage();
        books.push(book);
        saveBooksToStorage(books);

        const bookElement = createBookElement(book);
        
        if (book.isComplete) {
            completeBookshelfList.append(bookElement);
        } else {
            incompleteBookshelfList.append(bookElement);
        }

        clearForm();
    }

    function createBookElement(book) {
        const bookTitle = document.createElement("h3");
        bookTitle.innerText = book.title;

        const bookAuthor = document.createElement("p");
        bookAuthor.innerText = "Penulis: " + book.author;

        const bookYear = document.createElement("p");
        bookYear.innerText = "Tahun: " + book.year;

        const bookAction = document.createElement("div");
        bookAction.classList.add("action");

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Hapus buku";
        deleteButton.addEventListener("click", function() {
            const bookItem = this.parentElement.parentElement;
            bookItem.remove();
            deleteBookFromStorage(book.id);
        });

        if (book.isComplete) {
            const unreadButton = document.createElement("button");
            unreadButton.classList.add("green");
            unreadButton.innerText = "Belum selesai dibaca";
            unreadButton.addEventListener("click", function() {
                book.isComplete = false;
                updateBookInStorage(book);
                incompleteBookshelfList.append(this.parentElement.parentElement);
                this.parentElement.parentElement.remove();
            });

            bookAction.append(unreadButton);
        } else {
            const readButton = document.createElement("button");
            readButton.classList.add("green");
            readButton.innerText = "Selesai dibaca";
            readButton.addEventListener("click", function() {
                book.isComplete = true;
                updateBookInStorage(book);
                completeBookshelfList.append(this.parentElement.parentElement);
                this.parentElement.parentElement.remove();
            });

            bookAction.append(readButton);
        }

        bookAction.append(deleteButton);

        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        bookItem.append(bookTitle, bookAuthor, bookYear, bookAction);

        return bookItem;
    }

    function clearForm() {
        bookTitle.value = "";
        bookAuthor.value = "";
        bookYear.value = "";
        bookIsComplete.checked = false;
    }

    function saveBooksToStorage(books) {
        localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
    }

    function getBooksFromStorage() {
        const serializedData = localStorage.getItem(BOOKS_STORAGE_KEY);
        return JSON.parse(serializedData) || [];
    }

    function deleteBookFromStorage(bookId) {
        let books = getBooksFromStorage();
        books = books.filter(book => book.id !== bookId);
        saveBooksToStorage(books);
    }

    function updateBookInStorage(updatedBook) {
        let books = getBooksFromStorage();
        books = books.map(book => {
            if (book.id === updatedBook.id) {
                return updatedBook;
            }
            return book;
        });
        saveBooksToStorage(books);
    }

    function loadBooksFromStorage() {
        const books = getBooksFromStorage();
        books.forEach(book => {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookshelfList.append(bookElement);
            } else {
                incompleteBookshelfList.append(bookElement);
            }
        });
    }

    loadBooksFromStorage();

    const searchBookForm = document.getElementById("searchBook");
    const searchBookTitle = document.getElementById("searchBookTitle");

    searchBookForm.addEventListener("submit", function(event) {
        event.preventDefault();
        sessionStorage.setItem(SEARCH_STORAGE_KEY, searchBookTitle.value);
        searchBook();
    });

    function searchBook() {
        const searchTerm = sessionStorage.getItem(SEARCH_STORAGE_KEY);
        const books = getBooksFromStorage();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));

        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        filteredBooks.forEach(book => {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookshelfList.append(bookElement);
            } else {
                incompleteBookshelfList.append(bookElement);
            }
        });
    }

    function loadSearchTerm() {
        const searchTerm = sessionStorage.getItem(SEARCH_STORAGE_KEY);
        if (searchTerm) {
            searchBookTitle.value = searchTerm;
            searchBook();
        }
    }

    loadSearchTerm();
});
