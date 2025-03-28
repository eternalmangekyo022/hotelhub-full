using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Text.RegularExpressions;


namespace HotelAdminPanel
{
    /// <summary>
    /// Interaction logic for HotelManagement.xaml
    /// </summary>
    public partial class HotelManagement : Window
    {
        private void LoadSearchColumns()
        {
            searchsel.Items.Clear();
            searchsel.Items.Add("name");
            searchsel.Items.Add("city");
            searchsel.Items.Add("description");
            searchsel.SelectedIndex = 0;
        }
        private void NumberValidationTextBox(object sender, TextCompositionEventArgs e)
        {
            Regex regex = new Regex("[^0-9]+");
            e.Handled = regex.IsMatch(e.Text);
        }
        public HotelManagement()
        {
            InitializeComponent();
            LoadSearchColumns();
            Database database = new Database();
            database.LoadHotelsToDataGrid(hotelsData);
        }

        private void backbtn_Click(object sender, RoutedEventArgs e)
        {
            hotelsData.ItemsSource = null;
            GC.Collect();
            GC.WaitForPendingFinalizers();
            AdminPage adminPage = new AdminPage();
            adminPage.Show();
            Window.GetWindow(this)?.Close();
        }

        private void addHotelBtn_Click(object sender, RoutedEventArgs e)
        {
            Database database = new Database();
            database.ConnectToDatabase();
            int paymentid = 0;
            if (hotelName.Text == "" || price.Text == "" || city.Text == "" || payment.Text == "" || lat.Text == "" || lon.Text == "" || @class.Text == "" || description.Text == "")
            {
                MessageBox.Show("Please fill in the necessary information.", "Empty Fields", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
            else
            {
                if (payment.Text == "Cash")
                {
                    paymentid = 1;
                }
                else if (payment.Text == "Card")
                {
                    paymentid = 2;
                }
                else if (payment.Text == "Both")
                {
                    paymentid = 3;
                }
                database.AddHotel(hotelName, price, city, paymentid, cap, lat, lon, @class, description, rooms);
                database.LoadHotelsToDataGrid(hotelsData);
            }
        }

        private void deleteHotelBtn_Click(object sender, RoutedEventArgs e)
        {
            if (hotelsData.SelectedItem == null)
            {
                MessageBox.Show("Please select a user to delete.", "No Selection", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            DataRowView selectedRow = hotelsData.SelectedItem as DataRowView;

            if (selectedRow != null)
            {
                int hotelid = Convert.ToInt32(selectedRow["id"]);

                MessageBoxResult result = MessageBox.Show("Are you sure you want to delete this hotel?", "Confirm Deletion", MessageBoxButton.YesNo, MessageBoxImage.Question);

                if (result == MessageBoxResult.Yes)
                {
                    Database database = new Database();
                    database.DeleteHotel(hotelid);

                    database.LoadHotelsToDataGrid(hotelsData);
                }
            }
        }

        private void searchbtn_Click(object sender, RoutedEventArgs e)
        {
            resetbtn.Visibility = Visibility.Visible;
            string selectedColumn = searchsel.Text;
            string searchText = searchbox.Text;

            if (string.IsNullOrWhiteSpace(selectedColumn) || string.IsNullOrWhiteSpace(searchText))
            {
                MessageBox.Show("Please select a column and enter a search term.", "Invalid Input", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            Database database = new Database();
            hotelsData.ItemsSource = null;
            database.SearchHotels(searchText, hotelsData);
        }

        private void resetbtn_Click(object sender, RoutedEventArgs e)
        {
            Database database = new Database();
            hotelsData.ItemsSource = null;
            searchbox.Text = "";
            database.LoadHotelsToDataGrid(hotelsData);
        }

        private void adv_btn_Click(object sender, RoutedEventArgs e)
        {
            Database database = new Database();
            database.SortHotels(minsortprice, maxsortprice, minsortcap, maxsortcap, minrating, maxrating, hotelsData);
        }

        private void updateHotelBtn_Click(object sender, RoutedEventArgs e)
        {
            Database database = new Database();
            database.ConnectToDatabase();

            if (hotelsData.SelectedItem == null)
            {
                MessageBox.Show("Please select a hotel to update.", "No Selection", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }
            DataRowView selectedRow = hotelsData.SelectedItem as DataRowView;
            int hotelId = Convert.ToInt32(selectedRow["id"]);

            if (hotelName.Text == "" || price.Text == "" || city.Text == "" || payment.Text == "" || lat.Text == "" || lon.Text == "" || @class.Text == "" || description.Text == "")
            {
                MessageBox.Show("Please fill in the necessary information.", "Empty Fields", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
            else
            {
                int paymentid = 0;
                if (payment.Text == "Cash")
                {
                    paymentid = 1;
                }
                else if (payment.Text == "Card")
                {
                    paymentid = 2;
                }
                else if (payment.Text == "Both")
                {
                    paymentid = 3;
                }

                database.UpdateHotel(hotelId, hotelName, price, city, paymentid, cap, lat, lon, @class, description, rooms);

                database.LoadHotelsToDataGrid(hotelsData);

                MessageBox.Show("Hotel updated successfully!", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
            }
        }

        private void hotelsData_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Check if an item is selected
            if (hotelsData.SelectedItem is DataRowView selectedRow)
            {
                // Safely assign values to UI elements
                hotelName.Text = selectedRow["name"]?.ToString() ?? string.Empty;
                city.Text = selectedRow["city"]?.ToString() ?? string.Empty;

                // Set payment method based on the selected row
                string paymentMethod = selectedRow["payment"]?.ToString() ?? string.Empty;
                switch (paymentMethod)
                {
                    case "Cash":
                        payment.SelectedIndex = 1;
                        break;
                    case "Card":
                        payment.SelectedIndex = 0;
                        break;
                    case "Both":
                        payment.SelectedIndex = 2;
                        break;
                    default:
                        payment.SelectedIndex = -1; // No selection
                        break;
                }

                // Safely convert and assign numeric values
                price.Text = Convert.ToInt32(selectedRow["price"] ?? 0).ToString();
                lat.Text = Convert.ToDouble(selectedRow["lat"] ?? 0.0).ToString();
                lon.Text = Convert.ToDouble(selectedRow["lon"] ?? 0.0).ToString();
                cap.Text = Convert.ToInt32(selectedRow["capacity"] ?? 0).ToString();
                @class.Text = Convert.ToInt32(selectedRow["class"] ?? 0).ToString();
                rooms.Text = Convert.ToInt32(selectedRow["rooms"] ?? 0).ToString();
                description.Text = selectedRow["description"]?.ToString() ?? string.Empty;
            }
            else
            {
                // Clear the fields if no item is selected
                hotelName.Text = string.Empty;
                city.Text = string.Empty;
                payment.SelectedIndex = -1;
                price.Text = string.Empty;
                lat.Text = string.Empty;
                lon.Text = string.Empty;
                cap.Text = string.Empty;
                @class.Text = string.Empty;
                description.Text = string.Empty;
                rooms.Text = string.Empty;
            }
        }
    }
}
