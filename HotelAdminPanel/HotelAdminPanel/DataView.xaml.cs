using System;
using System.Collections.Generic;
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

namespace HotelAdminPanel
{
    /// <summary>
    /// Interaction logic for DataView.xaml
    /// </summary>
    public partial class DataView : Window
    {
        int selectedtable = 0;
        public DataView()
        {
            InitializeComponent();
        }

        private void LoadBookingsSearchColumns()
        {
            searchsel.Items.Clear();
            searchsel.Items.Add("booked");
            searchsel.Items.Add("checkin");
            searchsel.Items.Add("checkout");


        }

       
        private void LoadAmenitiesSearchColumns()
        {
            searchsel.Items.Clear();
        }

        private async void LoadBookingsAsync()
        {
            try
            {
                loadingProgressBar.Visibility = Visibility.Visible;
                dataGrid.ItemsSource = null;
                GC.Collect();
                GC.WaitForPendingFinalizers();

                Database database = new Database();
                await Task.Run(() => database.LoadBookingsToDataGrid(dataGrid));

                LoadBookingsSearchColumns();
                selectedtable = 1;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading bookings: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                // Hide the loading bar
                loadingProgressBar.Visibility = Visibility.Collapsed;
            }
        }


        private void ClearDateFilters()
        {
            bookedstart.SelectedDate = null;
            bookedend.SelectedDate = null;
            checkinstart.SelectedDate = null;
            checkinend.SelectedDate = null;
            checkoutstart.SelectedDate = null;
            checkoutend.SelectedDate = null;
        }

        private void bookingsbtn_Click(object sender, RoutedEventArgs e)
        {
            LoadBookingsAsync();
            AdvancedSearchPanel.Visibility = Visibility.Visible;
        }

        private void amenitiesbtn_Click(object sender, RoutedEventArgs e)
        {
            dataGrid.ItemsSource = null;
            GC.Collect();
            GC.WaitForPendingFinalizers();
            Database database = new Database();
            database.LoadAmenitiesToDataGrid(dataGrid);
            LoadAmenitiesSearchColumns();
            selectedtable = 2;

            AdvancedSearchPanel.Visibility = Visibility.Collapsed;

            ClearDateFilters();
        }

        private void backbtn_Click(object sender, RoutedEventArgs e)
        {
            dataGrid.ItemsSource = null;
            GC.Collect();
            GC.WaitForPendingFinalizers();
            AdminPage adminPage = new AdminPage();
            adminPage.Show();
            Window.GetWindow(this)?.Close();
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
            dataGrid.ItemsSource = null;
            if (selectedtable == 1)
            {
                database.SearchData("bookings", selectedColumn, searchText, dataGrid);
            }
            else if (selectedtable == 2)
            {
                database.SearchData("amenities", selectedColumn, searchText, dataGrid);
            }
            else
            {
                MessageBox.Show("Please select a table and enter a search term.", "Invalid Input", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private void resetbtn_Click(object sender, RoutedEventArgs e)
        {
            dataGrid.ItemsSource = null;
            GC.Collect();
            GC.WaitForPendingFinalizers();
            Database database = new Database();
            dataGrid.ItemsSource = null;
            searchbox.Text = "";
            if (selectedtable == 1)
            {
                LoadBookingsAsync();
                LoadBookingsSearchColumns();
            }
            else if (selectedtable == 2)
            {
                database.LoadAmenitiesToDataGrid(dataGrid);
                LoadAmenitiesSearchColumns();

            }
            else
            {
                MessageBox.Show("No table selected.", "Invalid Input", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private void adv_btn_Click(object sender, RoutedEventArgs e)
        {
            Database database = new Database();


            database.FilterBookings(bookedstart, bookedend, checkinstart, checkinend, checkoutstart, checkoutend, dataGrid);
        }
    }
}
