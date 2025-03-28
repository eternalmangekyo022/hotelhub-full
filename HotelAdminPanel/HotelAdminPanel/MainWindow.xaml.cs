using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using System.Windows;
using System.Windows.Controls;

namespace HotelAdminPanel
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public class Database
    {
        private readonly string connectionString;

        public Database()
        {
            connectionString = "Server=mysql-2632cb1f-tibcso0322-7da0.c.aivencloud.com;Port=27087;Database=hotels;Uid=avnadmin;Pwd=AVNS_JsONj4Ni1IT9ObgF_z4;";
        }

        public bool ConnectToDatabase()
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    Console.WriteLine("Successfully connected to the database.");
                    return true;
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error connecting to the database: {ex.Message}");
                return false;
            }
        }
        public string GetPassw(string email)
        {
            string password = null;
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "SELECT password FROM users WHERE email = @email";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@email", email);

                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                password = reader["password"].ToString();
                            }
                        }
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error retrieving password: {ex.Message}");
            }
            return password;


        }

        public int GetPerm(string email)
        {
            int perm = 0;
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "SELECT permissionId FROM users WHERE email = @email";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@email", email);

                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                perm = Convert.ToInt32(reader["permissionId"]);
                            }
                        }
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error retrieving permission: {ex.Message}");
            }
            return perm;


        }
        public void LoadUsersToDataGrid(DataGrid dataGrid)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"SELECT
                                        users.id,
                                        users.firstname,
                                        users.lastname,
                                        permissions.permission AS permission,
                                        users.phone,
                                        users.email,
                                        users.registered,
                                        users.password
                                    FROM users
                                    LEFT JOIN permissions ON users.permissionId = permissions.id;";

                    using (MySqlDataAdapter adapter = new MySqlDataAdapter(query, connection))
                    {
                        DataTable dataTable = new DataTable();

                        adapter.Fill(dataTable);

                        dataGrid.ItemsSource = dataTable.DefaultView;
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading users: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        public void LoadHotelsToDataGrid(DataGrid dataGrid)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"
                    SELECT 
                        hotels.id ,
                        hotels.name ,
                        hotels.price ,
                        COALESCE(AVG(bookings.rating), 0) AS average_rating,
                        hotels.city ,
                        payments.payment ,
                        hotels.lat,
                        hotels.lon,
                        hotels.capacity,
                        hotels.class ,
                        hotels.rooms,
                        hotels.description 
                    FROM hotels
                    LEFT JOIN payments ON hotels.payment_id = payments.id
                    LEFT JOIN bookings ON hotels.id = bookings.hotel_id
                    GROUP BY hotels.id;";
                    using (MySqlDataAdapter adapter = new MySqlDataAdapter(query, connection))
                    {
                        DataTable dataTable = new DataTable();

                        adapter.Fill(dataTable);

                        dataGrid.ItemsSource = dataTable.DefaultView;
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading hotels: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        public void LoadBookingsToDataGrid(DataGrid dataGrid)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"
                SELECT 
                    bookings.id AS BookingID,
                    CONCAT(users.firstname, ' ', users.lastname) AS userName,
                    hotels.name AS HotelName,
                    bookings.booked AS BookedDateTime,
                    bookings.checkin AS CheckInDateTime,
                    bookings.checkout AS CheckOutDateTime,
                    payments.payment AS Payment,
                    bookings.participants AS Participants,
                    bookings.rating As Rating
                FROM bookings
                LEFT JOIN users ON bookings.user_id = users.id
                LEFT JOIN hotels ON bookings.hotel_id = hotels.id
                LEFT JOIN payments ON bookings.payment_id = payments.id;";

                    using (MySqlDataAdapter adapter = new MySqlDataAdapter(query, connection))
                    {
                        DataTable dataTable = new DataTable();
                        adapter.Fill(dataTable);

                        Application.Current.Dispatcher.Invoke(() =>
                        {
                            dataGrid.ItemsSource = dataTable.DefaultView;
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Application.Current.Dispatcher.Invoke(() =>
                {
                    MessageBox.Show($"Error loading bookings: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                });
            }
        }

        

        public void LoadAmenitiesToDataGrid(DataGrid dataGrid)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"
                        SELECT 
                        hotels.name AS HotelName,
                        amenities.amenity AS AmenityName
                    FROM hotelamenities
                    LEFT JOIN hotels ON hotelamenities.hotel_id = hotels.id
                    LEFT JOIN amenities ON hotelamenities.amenity_id = amenities.id;
                    ";

                    using (MySqlDataAdapter adapter = new MySqlDataAdapter(query, connection))
                    {
                        DataTable dataTable = new DataTable();

                        adapter.Fill(dataTable);

                        Application.Current.Dispatcher.Invoke(() =>
                        {
                            dataGrid.ItemsSource = dataTable.DefaultView;
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Application.Current.Dispatcher.Invoke(() =>
                {
                    MessageBox.Show($"Error loading amenities: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                });
            }
        }

        public void DeleteUser(int id)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = "DELETE FROM users WHERE id = @id";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@id", id);
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error deleting user: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);

            }
        }

        public void UpdateUser(int id, TextBox firstn, TextBox lastn, ComboBox perm, TextBox phone, TextBox email, PasswordBox passw)
        {
            try
            {
                int permissionid = 0;
                if (perm.SelectedIndex == 0)
                {
                    permissionid = 1;
                }
                else if (perm.SelectedIndex == 1)
                {
                    permissionid = 2;
                }
                else if (perm.SelectedIndex == 2)
                {
                    permissionid = 3;
                }
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = "UPDATE users SET firstname = @first, lastname = @last, permissionId = @perm, phone = @phone, email = @email, registered = @date, password = @passw WHERE id = @id;";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {

                        command.Parameters.AddWithValue("@first", firstn.Text);
                        command.Parameters.AddWithValue("@last", lastn.Text);
                        command.Parameters.AddWithValue("@perm", permissionid);
                        command.Parameters.AddWithValue("@phone", phone.Text);
                        command.Parameters.AddWithValue("@email", email.Text);
                        command.Parameters.AddWithValue("@date", DateTime.Now.ToString("yyyy-MM-dd"));
                        command.Parameters.AddWithValue("@passw", ComputeMd5Hash(passw.Password));
                        command.Parameters.AddWithValue("@id", id);
                        command.ExecuteNonQuery();

                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error deleting user: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);

            }
        }

        public void AddUser(TextBox firstn, TextBox lastn, ComboBox perm, TextBox phone, TextBox email, PasswordBox passw)
        {
            int permissionid = 0;
            if (perm.SelectedIndex == 0)
            {
                permissionid = 0;
            }
            else if (perm.SelectedIndex == 1)
            {
                permissionid = 1;
            }
            else if (perm.SelectedIndex == 2)
            {
                permissionid = 2;
            }

            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "INSERT INTO users (firstname, lastname, permissionId, phone, email, registered, password) VALUES (@first, @last, @perm, @phone, @email, @date, @passw);";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@first", firstn.Text);
                        command.Parameters.AddWithValue("@last", lastn.Text);
                        command.Parameters.AddWithValue("@perm", permissionid);
                        command.Parameters.AddWithValue("@phone", phone.Text);
                        command.Parameters.AddWithValue("@email", email.Text);
                        command.Parameters.AddWithValue("@date", DateTime.Now.ToString("yyyy-MM-dd"));
                        command.Parameters.AddWithValue("@passw", ComputeMd5Hash(passw.Password));
                        command.ExecuteNonQuery();

                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error Adding User: {ex.Message}");
            }
        }

        public void AddHotel(TextBox name, TextBox price, TextBox city, int payment, TextBox cap, TextBox lat, TextBox lon, TextBox hotelclass, TextBox desc, TextBox rooms)
        {
            

            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "INSERT INTO hotels (name, price, city, payment_id, capacity, lat, lon, class, description, rooms) " +
                                   "VALUES (@name, @price, @city, @pay, @cap, @lat, @lon, @class, @desc, @rooms);";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@name", name.Text);
                        command.Parameters.AddWithValue("@price", price.Text);
                        command.Parameters.AddWithValue("@city", city.Text);
                        command.Parameters.AddWithValue("@pay", payment);
                        command.Parameters.AddWithValue("@class", hotelclass.Text);
                        command.Parameters.AddWithValue("@desc", desc.Text);
                        command.Parameters.AddWithValue("@cap", cap.Text);
                        command.Parameters.AddWithValue("@lat", lat.Text);
                        command.Parameters.AddWithValue("@lon", lon.Text);
                        command.Parameters.AddWithValue("@rooms", rooms.Text);

                        command.ExecuteNonQuery();

                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error Adding Hotel: {ex.Message}");
            }
        }
        public void DeleteHotel(int id)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = "DELETE FROM hotels WHERE id = @id";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@id", id);
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error deleting hotel: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);

            }
        }
        public void UpdateHotel(int hotelId, TextBox name, TextBox price, TextBox city, int payment, TextBox cap, TextBox lat, TextBox lon, TextBox hotelclass, TextBox desc, TextBox rooms)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "UPDATE hotels SET " +
                                   "name = @name, " +
                                   "price = @price, " +
                                   "city = @city, " +
                                   "payment_id = @pay, " +
                                   "capacity = @cap, " +
                                   "lat = @lat, " +
                                   "lon = @lon, " +
                                   "class = @class, " +
                                   "description = @desc " +
                                   "rooms = @rooms " +
                                   "WHERE id = @hotelId;";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@name", name.Text);
                        command.Parameters.AddWithValue("@price", price.Text);
                        command.Parameters.AddWithValue("@city", city.Text);
                        command.Parameters.AddWithValue("@pay", payment);
                        command.Parameters.AddWithValue("@class", hotelclass.Text);
                        command.Parameters.AddWithValue("@desc", desc.Text);
                        command.Parameters.AddWithValue("@cap", cap.Text);
                        command.Parameters.AddWithValue("@lat", lat.Text);
                        command.Parameters.AddWithValue("@lon", lon.Text);
                        command.Parameters.AddWithValue("@rooms", rooms.Text);
                        command.Parameters.AddWithValue("@hotelId", hotelId);

                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error Updating Hotel: {ex.Message}");
            }
        }
        public void SearchData(string table, string column, string searchText, DataGrid dataGrid)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = $"SELECT * FROM {table} WHERE {column} LIKE @searchText";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@searchText", $"%{searchText}%");

                        using (MySqlDataAdapter adapter = new MySqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);
                            dataGrid.ItemsSource = dataTable.DefaultView;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error during search: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        public void SearchHotels(string searchText, DataGrid dataGrid)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"
                SELECT 
                    hotels.id,
                    hotels.name,
                    hotels.price,
                    COALESCE(AVG(bookings.rating), 0) AS average_rating,
                    hotels.city,
                    payments.payment,
                    hotels.lat,
                    hotels.lon,
                    hotels.capacity,
                    hotels.class,
                    hotels.description
                FROM hotels
                LEFT JOIN payments ON hotels.payment_id = payments.id
                LEFT JOIN bookings ON hotels.id = bookings.hotel_id
                WHERE hotels.name LIKE @searchText 
                   OR hotels.city LIKE @searchText 
                   OR hotels.description LIKE @searchText
                GROUP BY hotels.id;";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {

                        command.Parameters.AddWithValue("@searchText", $"%{searchText}%");

                        using (MySqlDataAdapter adapter = new MySqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);
                            dataGrid.ItemsSource = dataTable.DefaultView;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error during hotel search: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        public void SearchUsers(string searchText, DataGrid dataGrid)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"
            SELECT 
                users.id,
                users.firstname,
                users.lastname,
                permissions.permission,
                users.phone,
                users.email,
                users.registered,
                users.password
            FROM users
            LEFT JOIN permissions ON users.permissionId = permissions.id
            WHERE users.firstname LIKE @searchText
               OR users.lastname LIKE @searchText 
               OR users.phone LIKE @searchText 
               OR users.email LIKE @searchText";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        // Add the search text parameter with wildcards
                        command.Parameters.AddWithValue("@searchText", $"%{searchText}%");

                        using (MySqlDataAdapter adapter = new MySqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);
                            dataGrid.ItemsSource = dataTable.DefaultView;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error during user search: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        public void SortHotels(TextBox minprice, TextBox maxprice, TextBox mincap, TextBox maxcap, TextBox minrating, TextBox maxrating, DataGrid dataGrid)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"
                SELECT 
                    hotels.id,
                    hotels.name,
                    hotels.price,
                    COALESCE(AVG(bookings.rating), 0.0) AS average_rating,
                    hotels.city,
                    payments.payment,
                    hotels.lat,
                    hotels.lon,
                    hotels.capacity,
                    hotels.class,
                    hotels.description
                FROM hotels
                LEFT JOIN payments ON hotels.payment_id = payments.id
                LEFT JOIN bookings ON hotels.id = bookings.hotel_id
                WHERE 1=1"; 

                    if (!string.IsNullOrEmpty(minprice.Text) && decimal.TryParse(minprice.Text, out decimal minPriceValue))
                    {
                        query += " AND hotels.price >= @minprice";
                    }
                    if (!string.IsNullOrEmpty(maxprice.Text) && decimal.TryParse(maxprice.Text, out decimal maxPriceValue))
                    {
                        query += " AND hotels.price <= @maxprice";
                    }
                    if (!string.IsNullOrEmpty(mincap.Text) && int.TryParse(mincap.Text, out int minCapValue))
                    {
                        query += " AND hotels.capacity >= @mincap";
                    }
                    if (!string.IsNullOrEmpty(maxcap.Text) && int.TryParse(maxcap.Text, out int maxCapValue))
                    {
                        query += " AND hotels.capacity <= @maxcap";
                    }

                    query += " GROUP BY hotels.id, hotels.name, hotels.price, hotels.city, payments.payment, hotels.lat, hotels.lon, hotels.capacity, hotels.class, hotels.description";

                    if (!string.IsNullOrEmpty(minrating.Text) && double.TryParse(minrating.Text, out double minRatingValue))
                    {
                        query += " HAVING COALESCE(AVG(bookings.rating), 0.0) >= @minrating";
                    }
                    if (!string.IsNullOrEmpty(maxrating.Text) && double.TryParse(maxrating.Text, out double maxRatingValue))
                    {
                        if (query.Contains("HAVING"))
                        {
                            query += " AND COALESCE(AVG(bookings.rating), 0.0) <= @maxrating";
                        }
                        else
                        {
                            query += " HAVING COALESCE(AVG(bookings.rating), 0.0) <= @maxrating";
                        }
                    }

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        if (!string.IsNullOrEmpty(minprice.Text) && decimal.TryParse(minprice.Text, out minPriceValue))
                        {
                            command.Parameters.AddWithValue("@minprice", minPriceValue);
                        }
                        if (!string.IsNullOrEmpty(maxprice.Text) && decimal.TryParse(maxprice.Text, out maxPriceValue))
                        {
                            command.Parameters.AddWithValue("@maxprice", maxPriceValue);
                        }
                        if (!string.IsNullOrEmpty(mincap.Text) && int.TryParse(mincap.Text, out minCapValue))
                        {
                            command.Parameters.AddWithValue("@mincap", minCapValue);
                        }
                        if (!string.IsNullOrEmpty(maxcap.Text) && int.TryParse(maxcap.Text, out maxCapValue))
                        {
                            command.Parameters.AddWithValue("@maxcap", maxCapValue);
                        }
                        if (!string.IsNullOrEmpty(minrating.Text) && double.TryParse(minrating.Text, out minRatingValue))
                        {
                            command.Parameters.AddWithValue("@minrating", minRatingValue);
                        }
                        if (!string.IsNullOrEmpty(maxrating.Text) && double.TryParse(maxrating.Text, out maxRatingValue))
                        {
                            command.Parameters.AddWithValue("@maxrating", maxRatingValue);
                        }

                        using (MySqlDataAdapter adapter = new MySqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);
                            dataGrid.ItemsSource = dataTable.DefaultView;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error during sorting and filtering: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        public void FilterBookings(DatePicker bookedStart, DatePicker bookedEnd,
                  DatePicker checkInStart, DatePicker checkInEnd,
                  DatePicker checkOutStart, DatePicker checkOutEnd,
                  DataGrid dataGrid)
        {
            try
            {
                // Validate date ranges
                if (bookedStart.SelectedDate.HasValue && bookedEnd.SelectedDate.HasValue &&
                    bookedStart.SelectedDate.Value > bookedEnd.SelectedDate.Value)
                {
                    MessageBox.Show("Booked start date cannot be after end date.", "Invalid Date Range",
                                    MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                if (checkInStart.SelectedDate.HasValue && checkInEnd.SelectedDate.HasValue &&
                    checkInStart.SelectedDate.Value > checkInEnd.SelectedDate.Value)
                {
                    MessageBox.Show("Check-in start date cannot be after end date.", "Invalid Date Range",
                                    MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                if (checkOutStart.SelectedDate.HasValue && checkOutEnd.SelectedDate.HasValue &&
                    checkOutStart.SelectedDate.Value > checkOutEnd.SelectedDate.Value)
                {
                    MessageBox.Show("Check-out start date cannot be after end date.", "Invalid Date Range",
                                    MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"
                SELECT 
                    id,
                    user_id,
                    hotel_id,
                    booked,
                    checkin,
                    checkout,
                    payment_id,
                    participants,
                    rating
                FROM bookings
                WHERE 1=1";

                    // Booked Date Range (datetime field)
                    if (bookedStart.SelectedDate.HasValue)
                    {
                        query += " AND booked >= @bookedStart";
                    }
                    if (bookedEnd.SelectedDate.HasValue)
                    {
                        query += " AND booked <= @bookedEnd";
                    }

                    // Check-in Date Range (datetime field)
                    if (checkInStart.SelectedDate.HasValue)
                    {
                        query += " AND checkin >= @checkInStart";
                    }
                    if (checkInEnd.SelectedDate.HasValue)
                    {
                        query += " AND checkin <= @checkInEnd";
                    }

                    // Check-out Date Range (datetime field)
                    if (checkOutStart.SelectedDate.HasValue)
                    {
                        query += " AND checkout >= @checkOutStart";
                    }
                    if (checkOutEnd.SelectedDate.HasValue)
                    {
                        query += " AND checkout <= @checkOutEnd";
                    }

                    query += " ORDER BY booked DESC";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        // Booked Date Parameters (include time component)
                        if (bookedStart.SelectedDate.HasValue)
                        {
                            command.Parameters.AddWithValue("@bookedStart", bookedStart.SelectedDate.Value.Date);
                        }
                        if (bookedEnd.SelectedDate.HasValue)
                        {
                            command.Parameters.AddWithValue("@bookedEnd", bookedEnd.SelectedDate.Value.Date.AddDays(1).AddTicks(-1));
                        }

                        // Check-in Date Parameters
                        if (checkInStart.SelectedDate.HasValue)
                        {
                            command.Parameters.AddWithValue("@checkInStart", checkInStart.SelectedDate.Value.Date);
                        }
                        if (checkInEnd.SelectedDate.HasValue)
                        {
                            command.Parameters.AddWithValue("@checkInEnd", checkInEnd.SelectedDate.Value.Date.AddDays(1).AddTicks(-1));
                        }

                        // Check-out Date Parameters
                        if (checkOutStart.SelectedDate.HasValue)
                        {
                            command.Parameters.AddWithValue("@checkOutStart", checkOutStart.SelectedDate.Value.Date);
                        }
                        if (checkOutEnd.SelectedDate.HasValue)
                        {
                            command.Parameters.AddWithValue("@checkOutEnd", checkOutEnd.SelectedDate.Value.Date.AddDays(1).AddTicks(-1));
                        }

                        using (MySqlDataAdapter adapter = new MySqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);
                            dataGrid.ItemsSource = dataTable.DefaultView;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error during filtering bookings: {ex.Message}", "Error",
                                MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        public string ComputeMd5Hash(string message)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] input = Encoding.UTF8.GetBytes(message);
                byte[] hash = md5.ComputeHash(input);

                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hash.Length; i++)
                {
                    sb.Append(hash[i].ToString("x2"));
                }
                return sb.ToString();
            }
        }

    }
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void loginbtn_Click(object sender, RoutedEventArgs e)
        {
            Database login = new Database();
            login.ConnectToDatabase();
            string email = usertxt.Text;
            string pwd = login.GetPassw(email);
            if (login.ComputeMd5Hash(pwdtxt.Password) == pwd)
            {
                if (login.GetPerm(email) == 2)
                {
                    StaffPage staffPage = new StaffPage();
                    staffPage.Show();
                    Window.GetWindow(this)?.Close();
                }
                else if (login.GetPerm(email) == 3)
                {
                    AdminPage adminPage = new AdminPage();
                    adminPage.Show();
                    Window.GetWindow(this)?.Close();
                }
                else
                {
                    MessageBox.Show("No Permission!");

                }

            }
            else
            {
                MessageBox.Show("Incorrect email or password!");

            }


        }
    }
}
