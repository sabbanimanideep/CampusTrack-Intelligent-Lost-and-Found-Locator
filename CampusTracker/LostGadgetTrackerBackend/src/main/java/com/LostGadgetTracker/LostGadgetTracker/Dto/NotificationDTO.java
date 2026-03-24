package com.LostGadgetTracker.LostGadgetTracker.Dto;



import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationDTO {

    private String type;      // LOST / FOUND
    private String title;     // item name
    private String location;  // place
    private String date;      // date
}
